import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  Copy,
  Trash2,
  Type,
  Hash,
  Mail,
  ChevronDown,
  CheckSquare,
  AlignLeft,
  Calendar
} from 'lucide-react';
import type { Field } from '../Layouts/Form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface FormFieldProps {
  field: Field;
  sectionId: string;
  selectedElement: { type: 'section' | 'field'; sectionId: string; fieldId?: string } | null;
  onSelectField: (fieldId: string, sectionId: string) => void;
  onDeleteField: (fieldId: string, sectionId: string) => void;
  onDuplicateField: (fieldId: string, sectionId: string) => void;
}

export const FormField: React.FC<FormFieldProps> = ({
  field,
  sectionId,
  selectedElement,
  onSelectField,
  onDeleteField,
  onDuplicateField
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: field.id,
    data: {
      type: 'FIELD',
      field,
      sectionId
    }
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1
  };

  const isFieldSelected =
    selectedElement?.type === 'field' &&
    selectedElement.sectionId === sectionId &&
    selectedElement.fieldId === field.id;

  const getFieldIcon = (type: Field['type']) => {
    switch (type) {
      case 'text': return <Type className="w-4 h-4" />;
      case 'number': return <Hash className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'select': return <ChevronDown className="w-4 h-4" />;
      case 'checkbox': return <CheckSquare className="w-4 h-4" />;
      case 'textarea': return <AlignLeft className="w-4 h-4" />;
      case 'date': return <Calendar className="w-4 h-4" />;
      case 'dropdown': return <ChevronDown className="w-4 h-4" />;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        onSelectField(field.id, sectionId);
      }}
      className={`group/field relative bg-brand-bg/40 hover:bg-brand-bg/85 border rounded-xl p-3.5 flex items-center justify-between gap-3 transition-all cursor-pointer ${isFieldSelected
        ? 'border-brand-purple ring-2 ring-brand-purple/10 shadow-sm'
        : 'border-brand-border/50 hover:border-brand-border'
        }`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div
          {...listeners}
          {...attributes}
          className="cursor-grab p-1 rounded hover:bg-gray-200 text-brand-gray/50 hover:text-brand-dark transition-colors active:cursor-grabbing"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-4 h-4" />
        </div>
        <div className="flex items-center gap-2 text-brand-gray/70">
          {getFieldIcon(field.type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-brand-dark truncate">{field.label}</span>
            {field.required && <span className="text-red-500 text-xs font-bold">*</span>}
          </div>
          <span className="text-2xs text-brand-gray/70 truncate block mt-0.5">
            {(field.type === 'select' || field.type === 'dropdown')
              ? `Dropdown • ${(field.options || []).length} Options`
              : `${field.type.charAt(0).toUpperCase() + field.type.slice(1)} Input ${field.placeholder ? `• "${field.placeholder}"` : ''
              }`}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1  transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onDuplicateField(field.id, sectionId);
          }}
          title="Duplicate Field"
        >
          <Copy className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteField(field.id, sectionId);
          }}
          className="hover:text-red-500"
          title="Delete Field"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
};

interface FormFieldPreviewProps {
  field: Field;
  value: any;
  error?: string;
  onChange: (fieldId: string, val: any) => void;
}

export const FormFieldPreview: React.FC<FormFieldPreviewProps> = ({
  field,
  value,
  error,
  onChange
}) => {
  const hasError = !!error;

  return (
    <div
      id={`preview_field_${field.id}`}
      className="flex flex-col gap-1.5 col-span-1"
    >
      {field.type !== 'checkbox' && (
        <Label htmlFor={`input_${field.id}`}>
          {field.label}
          {field.required && <span className="text-red-500 ml-1 font-bold">*</span>}
        </Label>
      )}

      {field.type === 'text' && (
        <Input
          id={`input_${field.id}`}
          type="text"
          placeholder={field.placeholder}
          value={value || ''}
          onChange={(e) => onChange(field.id, e.target.value)}
          aria-invalid={hasError}
        />
      )}

      {field.type === 'number' && (
        <Input
          id={`input_${field.id}`}
          type="number"
          placeholder={field.placeholder}
          value={value || ''}
          onChange={(e) => onChange(field.id, e.target.value)}
          aria-invalid={hasError}
        />
      )}

      {field.type === 'email' && (
        <Input
          id={`input_${field.id}`}
          type="email"
          placeholder={field.placeholder}
          value={value || ''}
          onChange={(e) => onChange(field.id, e.target.value)}
          aria-invalid={hasError}
        />
      )}

      {field.type === 'textarea' && (
        <Textarea
          id={`input_${field.id}`}
          placeholder={field.placeholder}
          value={value || ''}
          onChange={(e) => onChange(field.id, e.target.value)}
          aria-invalid={hasError}
        />
      )}

      {(field.type === 'select' || field.type === 'dropdown') && (
        <Select
          value={value || undefined}
          onValueChange={(val) => onChange(field.id, val)}
        >
          <SelectTrigger id={`input_${field.id}`} aria-invalid={hasError} className="w-full">
            <SelectValue placeholder="Select option..." />
          </SelectTrigger>
          <SelectContent>
            {(field.options || []).map((opt, oIdx) => (
              <SelectItem key={oIdx} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {field.type === 'date' && (
        <Input
          id={`input_${field.id}`}
          type="date"
          value={value || ''}
          onChange={(e) => onChange(field.id, e.target.value)}
          aria-invalid={hasError}
        />
      )}

      {field.type === 'checkbox' && (
        <div className="flex items-start gap-2.5 py-1">
          <Checkbox
            id={`check_${field.id}`}
            checked={value || false}
            onCheckedChange={(checked) => onChange(field.id, !!checked)}
          />
          <Label
            htmlFor={`check_${field.id}`}
            className="mb-0 leading-normal"
          >
            {field.label}
            {field.required && <span className="text-red-500 ml-1 font-bold">*</span>}
          </Label>
        </div>
      )}

      {hasError && (
        <span role="alert" className="text-2xs text-red-500 font-bold mt-1 error-message">
          {error}
        </span>
      )}
    </div>
  );
};

