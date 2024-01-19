import React from 'react';
import './App.scss';
import { FormFieldDefinition, useForm } from './form-components/useForm';
import { TextInput, TextInputProps } from './form-components/input-components/TextInput';
import { NumberInput, NumberInputProps } from './form-components/input-components/NumberInput';
import { SelectInput, SelectInputProps } from './form-components/input-components/SelectInput';
import { CheckboxInput, CheckboxInputProps } from './form-components/input-components/CheckboxInput';
import { FormFieldList } from './form-components/FormFieldList';
import { ControlPanel } from './form-components/ControlPanel';

export const App: React.FC = () => {
    const {
        formState,
        formFields,
        ContextProvider
    } = useForm({
        defaultFields: [
            {
                name: 'Text 1',
                component: TextInput,
                validation: v => v ? undefined : 'Required'
            } as FormFieldDefinition<TextInputProps>,
            {
                name: 'Number 1',
                component: NumberInput,
                validation: v => v ? undefined : 'Required'
            } as FormFieldDefinition<NumberInputProps>,
            {
                name: 'Select 1',
                component: SelectInput,
                validation: v => v ? undefined : 'Required'
            } as FormFieldDefinition<SelectInputProps>,
            {
                name: 'Checkbox 1',
                component: CheckboxInput,
                additionalProps: {
                    checkboxText: "Checkbox"
                }
            } as FormFieldDefinition<CheckboxInputProps>
        ]
    })

    return (
        <div className='main-page'>
            <ContextProvider>
                <FormFieldList
                    formFields={formFields}
                    formState={formState}
                />
                <ControlPanel
                    formFields={formFields}
                    formState={formState}
                />
            </ContextProvider>
        </div>
    )
}
