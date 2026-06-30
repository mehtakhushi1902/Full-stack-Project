import React, { useState } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCenter
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import {
    GripVertical,
    Plus,
    Trash2,
    Save,
    Copy,
    Settings,
    ChevronDown,
    Calendar,
    AlignLeft,
    CheckSquare,
    Mail,
    Hash,
    Type,
    Eye,
    Code,
    Check,
    X,
    Layers,
    ArrowRight,
    ClipboardList,
    PlusCircle,
    Info,
    MessageCircle,
    RefreshCw
} from 'lucide-react';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { useFormBuilder } from '../hooks/useFormBuilder';

import { FormSection, FormSectionPreview } from '../components/FormSection';

import type { Section, Field } from '../hooks/useFormBuilder';
export type { Field, Section };

import { useDraggable } from '@dnd-kit/core';

// Shadcn UI primitives
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { ChatBot } from '../components/ChatBot';

interface FieldTemplateItemProps {
    type: 'text' | 'number' | 'email' | 'select' | 'checkbox' | 'textarea' | 'date';
    label: string;
    icon: React.ReactNode;
}

const FieldTemplateItem: React.FC<FieldTemplateItemProps> = ({ type, label, icon }) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `template_${type}`,
        data: {
            type: 'FIELD_TEMPLATE',
            fieldType: type
        }
    });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            style={{ opacity: isDragging ? 0.5 : 1 }}
            className="flex items-center gap-3 p-3 border border-brand-border/60 hover:border-brand-purple/70 rounded-xl cursor-grab text-brand-dark hover:text-brand-purple font-medium text-xs transition-all active:cursor-grabbing hover:shadow-md select-none group"
        >
            <div className="p-2 bg-brand-bg rounded-lg group-hover:bg-brand-purple/10 text-brand-gray group-hover:text-brand-purple transition-colors">
                {icon}
            </div>
            <div>
                <p className="font-bold text-xs">{label}</p>
                <p className="text-2xs text-brand-gray/60 font-medium">Drag to canvas</p>
            </div>
        </div>
    );
};

const FormBuilder: React.FC = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const {
        sections,
        fields,
        // setFields,
        selectedElement,
        isPreviewMode,
        setIsPreviewMode,
        showSchemaModal,
        setShowSchemaModal,
        copiedSchema,
        formValues,
        formErrors,
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
        handleQuickAddField,
        updateSelectedField,
        handleAddOption,
        handleRemoveOption,
        handleUpdateOption,
        handleDuplicateField,
        handleDeleteField,
        saveSelectedElement,
        handleSelectField,
        handlePreviewInputChange,
        handlePreviewSubmit,
        copySchemaToClipboard,
        fetchData,

        fetchFieldsBySectionID,
    } = useFormBuilder();


    const paletteFields = [
        { type: 'text' as const, label: 'Text Input', icon: <Type className="w-4 h-4" /> },
        { type: 'number' as const, label: 'Number Input', icon: <Hash className="w-4 h-4" /> },
        { type: 'email' as const, label: 'Email Address', icon: <Mail className="w-4 h-4" /> },
        { type: 'select' as const, label: 'Dropdown Selector', icon: <ChevronDown className="w-4 h-4" /> },
        { type: 'textarea' as const, label: 'Textarea (Paragraph)', icon: <AlignLeft className="w-4 h-4" /> },
        { type: 'checkbox' as const, label: 'Checkbox Switch', icon: <CheckSquare className="w-4 h-4" /> },
        { type: 'date' as const, label: 'Date Picker', icon: <Calendar className="w-4 h-4" /> },

    ];

    const renderDragOverlay = () => {
        if (activeType === 'SECTION') {
            const section = sections.find((s) => s.id === activeId);
            if (!section) return null;
            return (
                <Card className="p-5 border-brand-purple/75 shadow-lg opacity-85 select-none w-section-overlay">
                    <div className="flex items-center gap-3">
                        <GripVertical className="w-5 h-5 text-brand-purple" />
                        <CardTitle className="text-base">{section.title}</CardTitle>
                    </div>
                </Card>
            );
        }

        if (activeType === 'FIELD') {
            const field = fields.find((f) => f.id === activeId);
            if (!field) return null;
            return (
                <Card className="border-brand-purple/75 p-3.5 flex-row items-center gap-3 shadow-md opacity-85 select-none w-field-overlay">
                    <GripVertical className="w-4 h-4 text-brand-purple" />
                    <span className="text-xs font-bold text-brand-dark">{field.label}</span>
                </Card>
            );
        }

        if (activeType === 'FIELD_TEMPLATE') {
            const item = paletteFields.find((p) => p.type === activeData?.fieldType);
            if (!item) return null;
            return (
                <Card className="flex-row items-center gap-3 p-3 border-brand-purple text-brand-purple font-medium text-xs shadow-md opacity-85 w-template-overlay">
                    <div className="p-2 bg-brand-purple/10 rounded-lg">
                        {item.icon}
                    </div>
                    <p className="font-bold text-xs">{item.label}</p>
                </Card>
            );
        }

        return null;
    };

    return (
        <Card className={`[box-shadow:none]  flex flex-col gap-6 max-w-dashboard mx-auto min-h-form-page transition-all duration-300 ease-in-out ${isChatOpen ? 'xl:mr-95' : ''}`}>
            <Card className="p-5 flex-col md:flex-row md:items-center gap-4">
                <CardTitle className="text-xl flex items-center gap-2">
                    <ClipboardList className="w-6 h-6 text-brand-purple" />
                    <span>Dynamic Form Builder</span>
                </CardTitle>
                <CardDescription className="mt-1 font-medium">
                    Create multi-section interactive schemas with smooth drag-and-drop mechanics.
                </CardDescription>

                <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center bg-brand-bg border border-brand-border p-1.5 rounded-xl">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setIsPreviewMode(false);
                                setSubmittedData(null);
                            }}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${!isPreviewMode
                                ? ' text-brand-purple shadow-sm ring-1 ring-black/5 '
                                : 'text-brand-gray hover:text-brand-dark'
                                }`}
                        >
                            <Settings className="w-3.5 h-3.5" />
                            <span>Build Mode</span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsPreviewMode(true)}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${isPreviewMode
                                ? ' text-brand-purple shadow-sm ring-1 ring-black/5 '
                                : 'text-brand-gray hover:text-brand-dark'
                                }`}
                        >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Live Preview</span>
                        </Button>
                    </div>

                    <Button
                        variant="secondary"
                        onClick={() => setShowSchemaModal(true)}
                        className="flex items-center gap-2 px-4 py-3 text-xs font-bold"
                    >
                        <Code className="w-4 h-4" />
                        <span>Export Schema</span>
                    </Button>
                </div>
            </Card>

            {!isPreviewMode ? (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <Card className={`[box-shadow:none]  grid grid-cols-1 gap-6 items-start ${isChatOpen ? 'xl:grid-cols-12' : 'lg:grid-cols-12'}`}>
                        <CardContent className={`flex flex-col gap-6 ${isChatOpen ? 'xl:col-span-4' : 'lg:col-span-4'}`}>
                            <Card className="p-0 overflow-hidden">
                                <CardContent className="flex border-b border-brand-border/40 p-2 gap-1 bg-brand-bg/20 rounded-t-2xl">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setActivePanelTab('build')}
                                        className={`flex-1 py-2 text-center rounded-xl text-xs font-bold transition-all cursor-pointer ${activePanelTab === 'build'
                                            ? ' text-brand-purple shadow-sm border border-brand-border/30 '
                                            : 'text-brand-gray hover:text-brand-dark'
                                            }`}
                                    >
                                        Create & Palette
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setActivePanelTab('properties')}
                                        className={`flex-1 py-2 text-center rounded-xl text-xs font-bold transition-all cursor-pointer relative ${activePanelTab === 'properties'
                                            ? ' text-brand-purple shadow-sm border border-brand-border/30 '
                                            : 'text-brand-gray hover:text-brand-dark'
                                            }`}
                                    >
                                        Properties Editor
                                        {selectedElement && (
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-brand-purple animate-pulse" />
                                        )}
                                    </Button>
                                </CardContent>

                                <CardContent className="p-5">
                                    {activePanelTab === 'build' ? (
                                        <Card className="[box-shadow:none]  flex flex-col gap-6">
                                            <h4 className="text-xs font-bold text-brand-dark mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                                                <Layers className="w-3.5 h-3.5 text-brand-purple" />
                                                <span>Add Form Section</span>
                                            </h4>
                                            <form onSubmit={handleAddSection} className="flex flex-col gap-3">
                                                <Input
                                                    type="text"
                                                    placeholder="e.g. Contact Address"
                                                    value={newSecTitle}
                                                    onChange={(e) => setNewSecTitle(e.target.value)}
                                                />
                                                <Input
                                                    type="text"
                                                    placeholder="Description (optional)"
                                                    value={newSecDesc}
                                                    onChange={(e) => setNewSecDesc(e.target.value)}
                                                />
                                                <Button
                                                    type="submit"
                                                    disabled={!newSecTitle.trim()}
                                                    className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs font-bold"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    <span>Create Section</span>
                                                </Button>
                                            </form>

                                            <hr className="border-brand-border/40" />

                                            {sections.length > 0 ? (
                                                <div>
                                                    <h4 className="text-xs font-bold text-brand-dark mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                                                        <PlusCircle className="w-3.5 h-3.5 text-brand-purple" />
                                                        <span>Quick Create Field</span>
                                                    </h4>
                                                    <form onSubmit={handleQuickAddField} className="flex flex-col gap-3">
                                                        <Input
                                                            type="text"
                                                            placeholder="Field Label (e.g. Phone Number)"
                                                            value={quickFieldLabel}
                                                            onChange={(e) => setQuickFieldLabel(e.target.value)}
                                                            required
                                                        />

                                                        <div className={`grid ${isChatOpen ? 'xl:grid-cols-1' : 'xl:grid-cols-2'} gap-2`}>
                                                            <div>
                                                                <Label className="text-2xs font-bold text-brand-gray mb-1">Type</Label>
                                                                <Select
                                                                    value={quickFieldType}
                                                                    onValueChange={(val) => setQuickFieldType(val as Field['type'])}
                                                                >
                                                                    <SelectTrigger className="w-full">
                                                                        <SelectValue placeholder="Select type" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="text">Text Input</SelectItem>
                                                                        <SelectItem value="number">Number</SelectItem>
                                                                        <SelectItem value="email">Email</SelectItem>
                                                                        <SelectItem value="select">Dropdown</SelectItem>
                                                                        <SelectItem value="textarea">Paragraph</SelectItem>
                                                                        <SelectItem value="checkbox">Checkbox</SelectItem>
                                                                        <SelectItem value="date">Date Picker</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>

                                                            <div>
                                                                <Label className="text-2xs font-bold text-brand-gray mb-1">Target Section</Label>
                                                                <Select
                                                                    value={quickFieldSection}
                                                                    onValueChange={(val) => setQuickFieldSection(val)}
                                                                >
                                                                    <SelectTrigger className="w-full">
                                                                        <SelectValue placeholder="Select section" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {sections.map((s) => (
                                                                            <SelectItem key={s.id} value={s.id}>
                                                                                {s.title}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2 py-1">
                                                            <Checkbox
                                                                id="quick-required"
                                                                checked={quickFieldRequired}
                                                                onCheckedChange={(checked) => setQuickFieldRequired(!!checked)}
                                                            />
                                                            <Label htmlFor="quick-required" className="text-xs text-brand-gray font-semibold mb-0">
                                                                Mark as required field
                                                            </Label>
                                                        </div>

                                                        <Button
                                                            type="submit"
                                                            disabled={!quickFieldLabel.trim() || !quickFieldSection}
                                                            className="w-full py-2.5 px-4 bg-brand-dark hover:bg-brand-dark/95 text-white text-xs font-bold"
                                                        >
                                                            Add to Section
                                                        </Button>
                                                    </form>
                                                </div>
                                            ) : (
                                                <Card className="p-4 bg-yellow-50 border-yellow-100 shadow-none">
                                                    <p className="text-xs text-yellow-700 font-bold text-center">Please create at least one section first before adding fields manually.</p>
                                                </Card>
                                            )}
                                        </Card>
                                    ) : (
                                        <Card className="py-0 [box-shadow:none]  flex flex-col gap-5">
                                            {!selectedElement ? (
                                                <Card className="text-center py-8 bg-brand-bg/20 border-brand-border/40 p-4 shadow-none">
                                                    <Settings className="w-8 h-8 text-brand-gray/30 mx-auto mb-2" />
                                                    <p className="text-xs font-bold text-brand-dark">No Element Selected</p>
                                                    <p className="text-2xs text-brand-gray mt-1 max-w-form-empty-copy mx-auto leading-relaxed">
                                                        Click any Section header or Field item on the canvas to inspect and edit its properties.
                                                    </p>
                                                </Card>
                                            ) : selectedElement.type === 'section' && selectedSection ? (
                                                <Card className="py-0 px-0 [box-shadow:none]  flex flex-col gap-4 ">
                                                    <CardContent className=" flex items-center justify-between pb-2 border-b border-brand-border/40">
                                                        <span className="text-2xs uppercase font-bold tracking-wider text-brand-purple">Section Editor</span>
                                                        <span className="text-2xs font-medium text-brand-gray italic">ID: {selectedSection.id}</span>
                                                    </CardContent>

                                                    <CardContent >
                                                        <Label >Section Title</Label>
                                                        <Input
                                                            type="text"
                                                            value={selectedSection.title}
                                                            onChange={(e) => updateSelectedSection({ title: e.target.value })}
                                                        />
                                                    </CardContent>

                                                    <CardContent>
                                                        <Label>Section Description</Label>
                                                        <Textarea
                                                            value={selectedSection.description || ''}
                                                            onChange={(e) => updateSelectedSection({ description: e.target.value })}
                                                            rows={3}
                                                            placeholder="Add brief details about this section..."
                                                            className="resize-none"
                                                        />
                                                    </CardContent>

                                                    <CardContent className="flex items-center gap-2 pt-2 border-t border-brand-border/40">
                                                        <Button
                                                            variant="destructive"
                                                            onClick={() => handleDeleteSection(selectedSection.id)}
                                                            className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                            <span>Delete Section</span>
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            onClick={() => saveSelectedElement()}
                                                            className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold"
                                                        >
                                                            <Save className="w-3.5 h-3.5" />
                                                            <span>Save Section</span>
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                            ) : selectedElement.type === 'field' && selectedField ? (
                                                <Card className="py-0 px-0 [box-shadow:none] flex flex-col gap-4">
                                                    <CardContent className="flex items-center justify-between pb-2 border-b border-brand-border/40">
                                                        <span className="text-2xs uppercase font-bold tracking-wider text-brand-purple">Field Editor</span>
                                                        <span className="text-2xs font-medium text-brand-gray italic">Type: {selectedField.type}</span>
                                                    </CardContent>

                                                    <CardContent>
                                                        <Label>Field Label</Label>
                                                        <Input
                                                            type="text"
                                                            value={selectedField.label}
                                                            onChange={(e) => updateSelectedField({ label: e.target.value })}
                                                        />
                                                    </CardContent>

                                                    {selectedField.type !== 'checkbox' && selectedField.type !== 'date' && (
                                                        <CardContent>
                                                            <Label>Placeholder Text</Label>
                                                            <Input
                                                                type="text"
                                                                value={selectedField.placeholder || ''}
                                                                onChange={(e) => updateSelectedField({ placeholder: e.target.value })}
                                                            />
                                                        </CardContent>
                                                    )}

                                                    <CardContent>
                                                        <Label>Input Format Type</Label>
                                                        <Select
                                                            value={selectedField.type}
                                                            onValueChange={(val) => {
                                                                const newType = val as Field['type'];
                                                                const placeholder = newType !== 'checkbox' && newType !== 'date' ? 'Enter value...' : undefined;
                                                                const options = (newType === 'select' || newType === 'dropdown') ? (selectedField.options || ['Option 1', 'Option 2', 'Option 3']) : undefined;
                                                                updateSelectedField({ type: newType, placeholder, options });
                                                            }}
                                                        >
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Select type" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="text">Text Input</SelectItem>
                                                                <SelectItem value="number">Number</SelectItem>
                                                                <SelectItem value="email">Email Address</SelectItem>
                                                                <SelectItem value="select">Dropdown Selector</SelectItem>
                                                                <SelectItem value="textarea">Paragraph Box</SelectItem>
                                                                <SelectItem value="checkbox">Single Checkbox</SelectItem>
                                                                <SelectItem value="date">Date Selector</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </CardContent>

                                                    <CardContent className="flex items-center gap-2 py-1.5 bg-brand-bg/30 p-2.5 rounded-xl border border-brand-border/40">
                                                        <Checkbox
                                                            id="field-req-toggle"
                                                            checked={selectedField.required}
                                                            onCheckedChange={(checked) => updateSelectedField({ required: !!checked })}
                                                        />
                                                        <Label htmlFor="field-req-toggle" className="text-xs text-brand-dark font-bold mb-0">
                                                            Required Field validation
                                                        </Label>
                                                    </CardContent>

                                                    {(selectedField.type === 'select' || selectedField.type === 'dropdown') && selectedField.options && (
                                                        <Card className="p-3.5 bg-brand-bg/30 border-brand-border/55 shadow-none">
                                                            <Label className="text-xs font-bold text-brand-dark mb-2.5">Dropdown Options</Label>

                                                            <CardContent className="flex flex-col gap-2 max-h-options-list overflow-y-auto pr-1">
                                                                {selectedField.options.map((opt, oIdx) => (
                                                                    <CardContent key={oIdx} className="flex items-center gap-1.5">
                                                                        <Input
                                                                            type="text"
                                                                            value={opt}
                                                                            onChange={(e) => handleUpdateOption(oIdx, e.target.value)}
                                                                            className="py-1.5 px-3"
                                                                        />
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => handleRemoveOption(oIdx)}
                                                                            disabled={selectedField.options!.length <= 1}
                                                                            className="p-1.5 h-7 w-7 text-brand-gray/70 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
                                                                            title="Remove option"
                                                                        >
                                                                            <Trash2 className="w-3.5 h-3.5" />
                                                                        </Button>
                                                                    </CardContent>
                                                                ))}
                                                            </CardContent>

                                                            <CardContent className="flex items-center gap-2 mt-3 pt-3 border-t border-brand-border/40">
                                                                <Input
                                                                    type="text"
                                                                    placeholder="New Option..."
                                                                    value={newOptionVal}
                                                                    onChange={(e) => setNewOptionVal(e.target.value)}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter') {
                                                                            e.preventDefault();
                                                                            handleAddOption(newOptionVal);
                                                                        }
                                                                    }}
                                                                    className="py-1.5 px-3"
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    onClick={() => handleAddOption(newOptionVal)}
                                                                    className="px-3 py-1.5 text-xs"
                                                                >
                                                                    Add
                                                                </Button>
                                                            </CardContent>
                                                        </Card>
                                                    )}

                                                    <CardContent className="grid grid-cols-2 gap-2 pt-3 border-t border-brand-border/40">
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => handleDuplicateField(selectedField.id, selectedElement.sectionId)}
                                                            className="flex items-center justify-center gap-1.5 py-2 font-bold text-2xs-plus text-brand-dark"
                                                        >
                                                            <Copy className="w-3.5 h-3.5 text-brand-gray" />
                                                            <span>Copy Field</span>
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            onClick={() => handleDeleteField(selectedField.id)}
                                                            className="flex items-center justify-center gap-1.5 py-2 text-2xs-plus"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                            <span>Delete Field</span>
                                                        </Button>

                                                        <Button
                                                            variant="destructive"
                                                            onClick={() => saveSelectedElement()}
                                                            className="flex items-center justify-center gap-1.5 py-2 text-2xs-plus"
                                                        >
                                                            <Save className="w-3.5 h-3.5" />
                                                            <span>Save Field</span>
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                            ) : null}
                                        </Card>
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="p-5 flex flex-col">
                                <h4 className="text-xs font-bold text-brand-dark mb-1 flex items-center gap-2 uppercase tracking-wider">
                                    <GripVertical className="w-4 h-4 text-brand-purple animate-pulse" />
                                    <span>Drag-and-Drop Palette</span>
                                </h4>
                                <p className="text-2xs text-brand-gray mb-4 font-medium">
                                    Pick templates and drag them onto the sections on the right.
                                </p>

                                <div className={`grid grid-cols-1 ${isChatOpen ? "xl:grid-cols-1" : "xl:grid-cols-2"} gap-2.5`}>
                                    {paletteFields.map((field) => (
                                        <FieldTemplateItem
                                            key={field.type}
                                            type={field.type}
                                            label={field.label}
                                            icon={field.icon}
                                        />
                                    ))}
                                </div>
                            </Card>
                        </CardContent>

                        <div className={`flex flex-col gap-5 min-h-section-overlay ${isChatOpen ? 'xl:col-span-8' : 'lg:col-span-8'}`}>
                            {sections.length === 0 ? (
                                <Card className="border-2 border-dashed border-brand-border/70 p-12 text-center items-center justify-center min-h-canvas-empty">
                                    <div className="w-16 h-16 bg-brand-purple/10 rounded-2xl flex items-center justify-center text-brand-purple mb-4">
                                        <Layers className="w-8 h-8" />
                                    </div>
                                    <CardTitle className="text-lg mb-1">Canvas is empty</CardTitle>
                                    <CardDescription className="max-w-sm mx-auto mb-6">
                                        Get started by adding a section on the left sidebar. Once sections exist, drag elements onto them.
                                    </CardDescription>
                                    <Button
                                        onClick={() => {
                                            handleAddSection({
                                                preventDefault: () => { }
                                            } as React.FormEvent);
                                        }}
                                        className="flex items-center gap-2 px-5 py-3 text-xs font-bold"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Add First Section</span>
                                    </Button>
                                </Card>
                            ) : (
                                <div className="flex flex-col gap-6">
                                    <div className="flex items-center justify-between px-1">
                                        <span className="text-xs font-bold text-brand-dark">Canvas ({sections.length} Sections)</span>
                                        <span className="text-2xs text-brand-gray/80 font-medium">
                                            💡 Tips: Drag by <GripVertical className="w-3.5 h-3.5 inline text-brand-gray/50" /> handle to sort sections/fields.
                                        </span>
                                        <span className="text-2xs text-brand-gray/80 font-medium">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={fetchData}
                                                className="hover:text-red-500"
                                                title="Refresh"
                                            >
                                                <RefreshCw className="w-4 h-4" />
                                            </Button>
                                        </span>
                                    </div>

                                    <SortableContext
                                        items={sections.map((s) => s.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <div className="flex flex-col gap-6">
                                            {sections.map((section) => (
                                                <FormSection
                                                    key={section.id}
                                                    section={section}
                                                    fields={fields.filter(f => f.sectionId === section.id)}
                                                    selectedElement={selectedElement}
                                                    onSelectSection={handleSelectSection}
                                                    onSelectField={handleSelectField}
                                                    onDeleteSection={handleDeleteSection}
                                                    onDeleteField={handleDeleteField}
                                                    onDuplicateField={handleDuplicateField}
                                                    isChatOpen={isChatOpen}
                                                    onFetchData={fetchData}
                                                    fetchFieldsBySectionID={fetchFieldsBySectionID}
                                                />
                                            ))}
                                        </div>
                                    </SortableContext>
                                </div>
                            )}
                        </div>
                    </Card>

                    <DragOverlay dropAnimation={null}>
                        {activeId ? renderDragOverlay() : null}
                    </DragOverlay>
                </DndContext>
            ) : (
                <div className="max-w-3xl mx-auto w-full">
                    <form onSubmit={handlePreviewSubmit} className="flex flex-col gap-6">
                        <Card className="p-6 relative overflow-hidden">
                            <div className="absolute right-0 top-0 w-32 h-32 bg-brand-purple/5 rounded-full blur-2xl" />
                            <CardHeader className="p-0 sm:flex-col sm:items-start mb-0">
                                <CardTitle className="text-lg">Preview Questionnaire</CardTitle>
                                <CardDescription className="text-xs mt-1 leading-relaxed">
                                    Test the end-user layout experience. Validation errors will trigger upon submission.
                                </CardDescription>
                            </CardHeader>

                            {sections.length === 0 && (
                                <Card className="mt-4 p-4 bg-yellow-50 border-yellow-100 shadow-none">
                                    <p className="text-xs text-yellow-700 font-bold text-center">There are no fields configured yet. Go back to Build Mode to design your form.</p>
                                </Card>
                            )}
                        </Card>

                        {sections.map((section) => (
                            <FormSectionPreview
                                key={section.id}
                                section={section}
                                fields={fields.filter(f => f.sectionId === section.id)}
                                formValues={formValues}
                                formErrors={formErrors}
                                onChange={handlePreviewInputChange}
                            />
                        ))}

                        {sections.length > 0 && (
                            <div className="flex items-center justify-end gap-3 pb-8 mt-2">
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => {
                                        setSubmittedData(null);
                                    }}
                                    className="px-5 py-3 text-xs font-bold"
                                >
                                    Clear Fields
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex items-center gap-2 px-6 py-3 text-xs font-bold shadow-md"
                                >
                                    <span>Submit Application</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                    </form>

                    {submittedData && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                            <Card className="max-w-xl w-full p-6 shadow-xl border-brand-border/60 animate-scaleIn flex flex-col gap-5">
                                <CardHeader className="p-0 mb-0 border-b border-brand-border/40 pb-3">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-9 h-9 rounded-xl bg-green-50 text-green-500 flex items-center justify-center">
                                            <Check className="w-5 h-5 font-bold" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-sm">Submission Successful!</CardTitle>
                                            <CardDescription className="font-medium">Valid schema form submission captured.</CardDescription>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSubmittedData(null)}
                                        className="p-1 h-8 w-8 text-brand-gray hover:text-brand-dark hover:bg-gray-100"
                                    >
                                        <X className="w-5 h-5" />
                                    </Button>
                                </CardHeader>

                                <CardContent className="p-0 overflow-x-auto max-h-modal-table border border-brand-border/50 rounded-xl">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Field</TableHead>
                                                <TableHead>Value</TableHead>
                                            </TableRow>
                                        </TableHeader>

                                        <TableBody>
                                            {fields.map((field) => {
                                                const val = submittedData[field.id];
                                                let stringVal = '';
                                                if (val === true) stringVal = 'Checked (Yes)';
                                                else if (val === false) stringVal = 'Unchecked (No)';
                                                else if (val === undefined || val === null || val === '') stringVal = '-';
                                                else stringVal = String(val);

                                                return (
                                                    <TableRow
                                                        key={field.id}
                                                        className="hover:bg-brand-bg/10"
                                                    >
                                                        <TableCell className="font-bold text-brand-dark">
                                                            {field.label}
                                                        </TableCell>

                                                        <TableCell className="text-brand-gray break-all">\
                                                            {stringVal}
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}

                                        </TableBody>
                                    </Table>
                                </CardContent>

                                <div className="flex justify-end pt-2">
                                    <Button
                                        onClick={() => {
                                            setSubmittedData(null);
                                        }}
                                        className="px-5 py-2.5 text-xs font-bold"
                                    >
                                        Okay, Reset Form
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    )}
                </div>
            )}

            {showSchemaModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-color-brand-dark backdrop-blur-lg p-4">
                    <Card className="max-w-2xl w-full p-6 shadow-xl border-brand-border/60 animate-scaleIn flex flex-col gap-4">
                        <CardHeader className="p-0 mb-0 border-b border-brand-border/40 pb-3">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center">
                                    <Code className="w-5 h-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-sm">Schema JSON Output</CardTitle>
                                    <CardDescription className="font-medium">Copy this configuration to re-render in backend pipelines.</CardDescription>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowSchemaModal(false)}
                                className="p-1 h-8 w-8 text-brand-gray hover:text-brand-dark hover:bg-gray-100"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </CardHeader>

                        <div className="relative">
                            <pre className="p-4  text-code-text rounded-xl text-2xs-plus overflow-auto max-h-schema-code font-mono leading-relaxed">
                                {JSON.stringify(sections, null, 2)}
                            </pre>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={copySchemaToClipboard}
                                className="absolute right-3 top-3 px-3 py-1.5   active:scale-95 text-white rounded-lg text-2xs font-bold border border-white/10 backdrop-blur-md transition-all"
                            >
                                {copiedSchema ? 'Copied!' : 'Copy Schema'}
                            </Button>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-brand-border/40">
                            <span className="text-2xs text-brand-gray flex items-center gap-1.5">
                                <Info className="w-3.5 h-3.5 text-brand-purple" />
                                <span>Compatible with standard React UI engines.</span>
                            </span>
                            <Button
                                onClick={() => setShowSchemaModal(false)}
                                className="px-5 py-2.5 text-xs font-bold"
                            >
                                Close Window
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
            {!isChatOpen && (
                <button
                    onClick={() => setIsChatOpen(true)}
                    className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-xl bg-brand-purple hover:bg-brand-purple/90 transition-all hover:scale-105 active:scale-95 flex items-center justify-center group"
                    aria-label="Open AI Chat Assistant"
                >
                    <MessageCircle className="w-6 h-6 text-white" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
                </button>
            )}
            <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </Card>
    );
};

export const Form: React.FC = () => {
    return (
        <FormBuilder />
    );
};
