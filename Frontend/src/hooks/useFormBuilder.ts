import { useState, useCallback, useEffect } from 'react';
import {
  useSensor,
  useSensors,
  PointerSensor
} from '@dnd-kit/core';
import type {
  DragStartEvent,
  DragOverEvent,
  DragEndEvent
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

export interface Field {
  id: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'select' | 'checkbox' | 'textarea' | 'date' | 'dropdown';
  placeholder?: string;
  required: boolean;
  options?: string[];
  sectionId?: string;
  order?: number;
}

export interface Section {
  id: string;
  title: string;
  description?: string;
  order?: number;
}

export const DEFAULT_SECTIONS: Section[] = [

];

export const DEFAULT_FIELDS: Field[] = [

];


export const useFormBuilder = () => {
  const [sections, setSections] = useState<Section[]>(DEFAULT_SECTIONS);
  const [fields, setFields] = useState<Field[]>(DEFAULT_FIELDS);
  const [selectedElement, setSelectedElement] = useState<{
    type: 'section' | 'field';
    sectionId: string;
    fieldId?: string;
  } | null>(null);

  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [showSchemaModal, setShowSchemaModal] = useState<boolean>(false);
  const [copiedSchema, setCopiedSchema] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<{ [key: string]: any }>({});
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [submittedData, setSubmittedData] = useState<{ [key: string]: any } | null>(null);

  const [activePanelTab, setActivePanelTab] = useState<'build' | 'properties'>('build');

  const [newSecTitle, setNewSecTitle] = useState('');
  const [newSecDesc, setNewSecDesc] = useState('');

  const [quickFieldLabel, setQuickFieldLabel] = useState('');
  const [quickFieldType, setQuickFieldType] = useState<Field['type']>('text');
  const [quickFieldSection, setQuickFieldSection] = useState(sections[0]?.id || '');
  const [quickFieldRequired, setQuickFieldRequired] = useState(false);

  const [newOptionVal, setNewOptionVal] = useState('');

  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<'SECTION' | 'FIELD' | 'FIELD_TEMPLATE' | null>(null);
  const [activeData, setActiveData] = useState<any>(null);

  const selectedSection = sections.find(s => s.id === selectedElement?.sectionId) || null;
  const selectedField = fields.find(f => f.id === selectedElement?.fieldId) || null;

  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (sections.length > 0 && (!quickFieldSection || !sections.some(s => s.id === quickFieldSection))) {
      setQuickFieldSection(sections[0].id);
    }
  }, [sections, quickFieldSection]);

  // Fetch sections and fields from backend on mount


  const fetchData = async () => {
    try {
      const [sectionsRes, fieldsRes] = await Promise.all([
        fetch(`${baseUrl}/sections`),
        fetch(`${baseUrl}/fields`)
      ]);
      if (!sectionsRes.ok || !fieldsRes.ok) throw new Error('Failed to load data');
      const sectionsData = await sectionsRes.json();
      const fieldsData = await fieldsRes.json();
      // Handle both raw array responses and { data: [] } envelope shapes
      setSections(Array.isArray(sectionsData) ? sectionsData : (sectionsData?.data ?? []));
      setFields(Array.isArray(fieldsData) ? fieldsData : (fieldsData?.data ?? []));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFieldsBySectionID = async (sectionId: string) => {
    try {
      const fieldsRes = await fetch(
        `${baseUrl}/fields/getFields/${sectionId}`
      );

      if (!fieldsRes.ok) {
        throw new Error("Failed to load data");
      }

      const fieldsData = await fieldsRes.json();
      const fieldsArray = Array.isArray(fieldsData) ? fieldsData : (fieldsData?.data ?? []);

      setFields((prev) => [
        ...prev.filter(
          (field) => field.sectionId !== sectionId
        ),
        ...fieldsArray,
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    })
  );

  const findSectionOfField = useCallback((fieldId: string) => {
    const field = fields.find(f => f.id === fieldId);
    return field ? sections.find(s => s.id === field.sectionId) : undefined;
  }, [sections, fields]);


  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    const type = active.data.current?.type;
    setActiveType(type);
    setActiveData(active.data.current);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const dragId = active.id as string;
    const hoverId = over.id as string;

    if (dragId === hoverId) return;

    const dragType = active.data.current?.type;
    const hoverType = over.data.current?.type;

    if (dragType !== 'FIELD') return;

    const activeSection = findSectionOfField(dragId);
    let overSectionId = '';

    if (hoverType === 'SECTION') {
      overSectionId = hoverId;
    } else if (hoverType === 'FIELD') {
      const sec = findSectionOfField(hoverId);
      overSectionId = sec ? sec.id : '';
    }

    if (!activeSection || !overSectionId) {
      return;
    }

    // Update the dragged field's sectionId
    setFields((prev) =>
      prev.map((f) =>
        f.id === dragId ? { ...f, sectionId: overSectionId } : f
      )
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);
    setActiveType(null);
    setActiveData(null);

    if (!over) return;

    const dragId = active.id as string;
    const hoverId = over.id as string;

    const dragType = active.data.current?.type;
    const hoverType = over.data.current?.type;

    if (dragType === 'SECTION') {
      if (dragId === hoverId) return;
      const oldIndex = sections.findIndex((s) => s.id === dragId);
      const newIndex = sections.findIndex((s) => s.id === hoverId);
      if (oldIndex === -1 || newIndex === -1) return;

      const newSections = arrayMove(sections, oldIndex, newIndex);
      setSections(newSections);

      const updates = newSections.map((s, index) => ({ id: s.id, order: index }));
      fetch(`${baseUrl}/sections/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      }).catch(console.error);

      return;
    }

    if (dragType === 'FIELD') {
      const overSection = findSectionOfField(hoverId);
      const targetSectionId = hoverType === 'SECTION' ? hoverId : (overSection ? overSection.id : undefined);
      if (!targetSectionId) return;

      const oldIndex = fields.findIndex((f) => f.id === dragId);
      const newIndex = hoverType === 'FIELD' ? fields.findIndex((f) => f.id === hoverId) : oldIndex;
      if (oldIndex === -1) return;

      let newFields = [...fields];
      newFields[oldIndex] = { ...newFields[oldIndex], sectionId: targetSectionId };

      if (dragId !== hoverId && newIndex !== -1 && hoverType === 'FIELD') {
        newFields = arrayMove(newFields, oldIndex, newIndex);
      }

      setFields(newFields);

      const updates = newFields.map((f, index) => ({ id: f.id, order: index, sectionId: f.sectionId }));
      fetch(`${baseUrl}/fields/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      }).catch(console.error);

      return;
    }

    if (dragType === 'FIELD_TEMPLATE') {
      const fieldType = active.data.current?.fieldType;
      let targetSectionId = '';
      let hoverFieldId: string | undefined = undefined;

      if (hoverType === 'SECTION') {
        targetSectionId = hoverId;
      } else if (hoverType === 'FIELD') {
        const sec = findSectionOfField(hoverId);
        targetSectionId = sec ? sec.id : '';
        hoverFieldId = hoverId;
      }

      if (targetSectionId && fieldType) {
        addFieldFromTemplate(fieldType, targetSectionId, hoverFieldId);
      }
    }
  };


  const addFieldFromTemplate = useCallback(async (
    fieldType: Field['type'],
    targetSectionId: string,
    hoverFieldId?: string
  ) => {
    try {
      const body = {
        label: `New ${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)}`,
        type: fieldType,
        placeholder: fieldType !== 'checkbox' && fieldType !== 'date' ? 'Enter value...' : undefined,
        required: false,
        options: fieldType === 'select' ? ['Option 1', 'Option 2', 'Option 3'] : undefined,
        sectionId: targetSectionId,
      };
      const response = await fetch(`${baseUrl}/fields`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!response.ok) throw new Error('Failed to create field from template');
      const created: Field = await response.json();
      setFields((prev) => {
        if (hoverFieldId) {
          const hoverIndex = prev.findIndex((f) => f.id === hoverFieldId);
          if (hoverIndex !== -1) {
            const newArr = [...prev];
            newArr.splice(hoverIndex, 0, created);
            return newArr;
          }
        }
        return [...prev, created];
      });
      setSelectedElement({ type: 'field', sectionId: targetSectionId, fieldId: created.id });
      setActivePanelTab('properties');
    } catch (err) {
      console.error(err);
    }
  }, [baseUrl]);


  // Section handlers
  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSecTitle.trim()) return;
    try {
      const response = await fetch(`${baseUrl}/sections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // credentials: 'include',
        body: JSON.stringify({ title: newSecTitle.trim(), description: newSecDesc.trim() || undefined })
      });
      if (!response.ok) throw new Error('Failed to create section');
      const created = await response.json();
      setSections((prev) => [...prev, created]);
      setNewSecTitle('');
      setNewSecDesc('');
      setSelectedElement({ type: 'section', sectionId: created.id });
      setActivePanelTab('properties');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSection = useCallback(async (secId: string) => {
    try {
      const response = await fetch(`${baseUrl}/sections/${secId}`, { method: 'DELETE', });
      if (!response.ok) throw new Error('Failed to delete section');
      setSections((prev) => prev.filter((s) => s.id !== secId));
      setSelectedElement((current) => {
        if (current && current.sectionId === secId) {
          return null;
        }
        return current;
      });
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleSelectSection = useCallback((secId: string) => {
    setSelectedElement({ type: 'section', sectionId: secId });
    setActivePanelTab('properties');
  }, []);


  const updateSelectedSection = (updates: Partial<Section>) => {
    if (!selectedElement || selectedElement.type !== 'section') return;
    // Local state only — call saveSelectedElement() to persist
    setSections((prev) =>
      prev.map((s) => (s.id === selectedElement.sectionId ? { ...s, ...updates } : s))
    );
  };

  // Fields handlers

  const handleQuickAddField = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickFieldLabel.trim() || !quickFieldSection) return;
    try {
      const response = await fetch(`${baseUrl}/fields`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // credentials: 'include',
        body: JSON.stringify({ label: quickFieldLabel.trim(), type: quickFieldType, placeholder: quickFieldType !== 'checkbox' && quickFieldType !== 'date' ? 'Enter value...' : undefined, required: quickFieldRequired, options: quickFieldType === 'select' ? ['Option 1', 'Option 2', 'Option 3'] : undefined, sectionId: quickFieldSection })
      });
      if (!response.ok) throw new Error('Failed to create field');
      const created = await response.json();
      setFields((prev) => [...prev, created]);
      setQuickFieldLabel('');
      setQuickFieldRequired(false);
      setSelectedElement({ type: 'field', sectionId: quickFieldSection, fieldId: created.id });
      setActivePanelTab('properties');
    } catch (err) {
      console.error(err);
    }
  };

  const updateSelectedField = (updates: Partial<Field>) => {
    if (!selectedElement || selectedElement.type !== 'field' || !selectedElement.fieldId) return;
    setFields((prev) =>
      prev.map((f) => (f.id === selectedElement.fieldId ? { ...f, ...updates } : f))
    );
  };

  const saveSelectedElement = async () => {
    if (!selectedElement) return;
    setIsSaving(true);
    try {
      if (selectedElement.type === 'section') {
        const section = sections.find((s) => s.id === selectedElement.sectionId);
        if (!section) return;
        const response = await fetch(`${baseUrl}/sections/${section.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: section.title, description: section.description }),
        });
        if (!response.ok) throw new Error('Failed to save section');
      } else if (selectedElement.type === 'field' && selectedElement.fieldId) {
        const field = fields.find((f) => f.id === selectedElement.fieldId);
        if (!field) return;
        const { id, ...rest } = field;
        const response = await fetch(`${baseUrl}/fields/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(rest),
        });
        if (!response.ok) throw new Error('Failed to save field');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDuplicateField = useCallback((fieldId: string, secId: string) => {
    setFields((prev) => {
      const idx = prev.findIndex((f) => f.id === fieldId);
      if (idx === -1) return prev;
      const original = prev[idx];
      const copy: Field = {
        ...original,
        id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        label: `${original.label} (Copy)`,
        options: original.options ? [...original.options] : undefined,
        sectionId: secId,
      };
      const newArr = [...prev];
      newArr.splice(idx + 1, 0, copy);
      return newArr;
    });
  }, []);


  const handleDeleteField = useCallback(async (fieldId: string, secId: string) => {
    try {
      const response = await fetch(`${baseUrl}/fields/${fieldId}`, {
        method: 'DELETE',
        // credentials: 'include' 
      });
      if (!response.ok) throw new Error('Failed to delete field');
      setFields((prev) => prev.filter((f) => f.id !== fieldId));
      setSelectedElement((current) => {
        if (current && current.type === 'field' && current.fieldId === fieldId) {
          return null;
        }
        return current;
      });
    } catch (err) {
      console.error(err);
    }
  }, []);



  const handleSelectField = useCallback((fieldId: string, secId: string) => {
    setSelectedElement({ type: 'field', sectionId: secId, fieldId });
    setActivePanelTab('properties');
  }, []);

  // checkbox options handlers

  const handleAddOption = (option: string) => {
    if (!option.trim() || !selectedField) return;
    const options = selectedField.options || [];
    if (!options.includes(option.trim())) {
      updateSelectedField({ options: [...options, option.trim()] });
    }
    setNewOptionVal('');
  };

  const handleRemoveOption = (index: number) => {
    if (!selectedField || !selectedField.options) return;
    const newOptions = selectedField.options.filter((_, i) => i !== index);
    updateSelectedField({ options: newOptions });
  };

  const handleUpdateOption = (index: number, val: string) => {
    if (!selectedField || !selectedField.options) return;
    const newOptions = [...selectedField.options];
    newOptions[index] = val;
    updateSelectedField({ options: newOptions });
  };


  const handlePreviewInputChange = (fieldId: string, val: any) => {
    setFormValues((prev) => ({ ...prev, [fieldId]: val }));
    if (formErrors[fieldId]) {
      setFormErrors((prev) => {
        const copy = { ...prev };
        delete copy[fieldId];
        return copy;
      });
    }
  };

  const handlePreviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    // sections.forEach((sec) => {
    // sec.fields.forEach((field) => {
    //   const val = formValues[field.id];
    //   if (field.required) {
    //     if (field.type === 'checkbox') {
    //       if (!val) errors[field.id] = 'This agreement is required.';
    //     } else {
    //       if (val === undefined || val === null || String(val).trim() === '') {
    //         errors[field.id] = `${field.label} is required.`;
    //       }
    //     }
    //   });
    // });
    // }) ;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      const firstErrorId = Object.keys(errors)[0];
      const errorEl = document.getElementById(`preview_field_${firstErrorId}`);
      if (errorEl) {
        errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setSubmittedData(formValues);
  };

  const copySchemaToClipboard = () => {
    const schemaJSON = JSON.stringify(sections, null, 2);
    navigator.clipboard.writeText(schemaJSON).then(() => {
      setCopiedSchema(true);
      setTimeout(() => setCopiedSchema(false), 2000);
    });
  };

  useEffect(() => {

    fetchData();
  }, []);


  return {
    sections,
    setSections,
    fields,
    setFields,
    selectedElement,
    setSelectedElement,
    isPreviewMode,
    setIsPreviewMode,
    showSchemaModal,
    setShowSchemaModal,
    copiedSchema,
    formValues,
    setFormValues,
    formErrors,
    setFormErrors,
    submittedData,
    setSubmittedData,
    activePanelTab,
    setActivePanelTab,

    newSecTitle,
    setNewSecTitle,
    newSecDesc,
    setNewSecDesc,
    quickFieldLabel,
    setQuickFieldLabel,
    quickFieldType,
    setQuickFieldType,
    quickFieldSection,
    setQuickFieldSection,
    quickFieldRequired,
    setQuickFieldRequired,
    newOptionVal,
    setNewOptionVal,

    activeId,
    activeType,
    activeData,
    sensors,

    selectedSection,
    selectedField,

    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleAddSection,
    handleDeleteSection,
    handleSelectSection,
    updateSelectedSection,
    saveSelectedElement,
    isSaving,
    handleQuickAddField,
    updateSelectedField,
    handleAddOption,
    handleRemoveOption,
    handleUpdateOption,
    handleDuplicateField,
    handleDeleteField,

    handleSelectField,
    handlePreviewInputChange,
    handlePreviewSubmit,
    copySchemaToClipboard,
    fetchData,
    fetchFieldsBySectionID,
  };
};
