import React from 'react';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Settings, Trash2, Layers, RefreshCw } from 'lucide-react';
import type { Section, Field } from '../hooks/useFormBuilder';
import { FormField, FormFieldPreview } from './FormField';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface FormSectionProps {
  section: Section;
  fields: Field[];
  selectedElement: { type: 'section' | 'field'; sectionId: string; fieldId?: string } | null;
  onSelectSection: (id: string) => void;
  onSelectField: (fieldId: string, sectionId: string) => void;
  onDeleteSection: (id: string) => void;
  onDeleteField: (fieldId: string, sectionId: string) => void;
  onDuplicateField: (fieldId: string, sectionId: string) => void;
  onFetchData: () => void;
  fetchFieldsBySectionID: (sectionId: string) => void;
  isChatOpen: boolean
}

export const FormSection: React.FC<FormSectionProps> = ({
  section,
  fields,
  selectedElement,
  onSelectSection,
  onSelectField,
  onDeleteSection,
  onDeleteField,
  onDuplicateField,
  isChatOpen,
  onFetchData,
  fetchFieldsBySectionID,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: section.id,
    data: {
      type: 'SECTION',
      section
    }
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1
  };

  const isSectionSelected = selectedElement?.type === 'section' && selectedElement.sectionId === section.id;
  const baseUrl = "http://localhost:3000"


  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={isSectionSelected ? 'border-brand-purple ring-2 ring-brand-purple/10' : ''}
    >
      <CardHeader className="p-5 border-b border-brand-border/40 bg-brand-bg/20 rounded-t-2xl mb-0 flex flex-row">

        <CardDescription className="flex items-center gap-3 flex-1 min-w-0">
          <CardContent
            {...listeners}
            {...attributes}
            className="cursor-grab hover:bg-gray-100 p-1.5 rounded-lg text-brand-gray/60 hover:text-brand-dark transition-colors active:cursor-grabbing"
            title="Drag Section"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="w-5 h-5" />
          </CardContent>

          <CardContent className="flex-1 min-w-0 cursor-pointer" onClick={() => onSelectSection(section.id)}>
            <CardTitle className="text-base leading-snug truncate">{section.title}</CardTitle>
            {section.description ? (
              <CardDescription className="truncate mt-0.5">{section.description}</CardDescription>
            ) : (
              <CardDescription className="text-brand-gray/60 italic mt-0.5">No description provided.</CardDescription>
            )}
          </CardContent>

        </CardDescription>

        <CardDescription className="flex items-center gap-1 ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelectSection(section.id)}

            title="Section Properties"
          >
            <Settings className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDeleteSection(section.id)}
            className="hover:text-red-500"
            title="Delete Section"
          >
            <Trash2 className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchFieldsBySectionID(section.id)}
            className="hover:text-red-500"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </CardDescription>
      </CardHeader>

      <CardDescription className="p-5 flex flex-col gap-4 min-h-field-empty">
        {fields.length === 0 ? (
          <CardContent className="flex-1 border-2 border-dashed border-brand-border/50 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-brand-bg/10 select-none">
            <Layers className="w-6 h-6 text-brand-gray/40 mb-2" />
            <p className="text-xs font-semibold text-brand-gray">Empty Section</p>
            <p className="text-2xs text-brand-gray/60 mt-1 max-w-form-empty-copy">
              Drag templates from the left palette and drop them here.
            </p>
          </CardContent>
        ) : (
          <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
            <CardContent className={`grid grid-cols-1 ${isChatOpen ? 'xl:grid-cols-1' : 'xl:grid-cols-2'}  gap-3 `}>
              {fields.map((field) => (
                <FormField
                  key={field.id}
                  field={field}
                  sectionId={section.id}
                  selectedElement={selectedElement}
                  onSelectField={onSelectField}
                  onDeleteField={onDeleteField}
                  onDuplicateField={onDuplicateField}
                />
              ))}
            </CardContent>
          </SortableContext>
        )}
      </CardDescription>
    </Card>
  );
};

interface FormSectionPreviewProps {
  section: Section;
  fields: Field[];
  formValues: { [key: string]: any };
  formErrors: { [key: string]: string };
  onChange: (fieldId: string, val: any) => void;
}

export const FormSectionPreview: React.FC<FormSectionPreviewProps> = ({
  section,
  fields,
  formValues,
  formErrors,
  onChange
}) => {
  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle>{section.title}</CardTitle>
        {section.description && (
          <CardDescription>{section.description}</CardDescription>
        )}
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {fields.length === 0 ? (
          <p className="text-xs text-brand-gray/50 italic col-span-2 py-2">No fields inside this section.</p>
        ) : (
          fields.map((field) => (
            <FormFieldPreview
              key={field.id}
              field={field}
              value={formValues[field.id]}
              error={formErrors[field.id]}
              onChange={onChange}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
};
