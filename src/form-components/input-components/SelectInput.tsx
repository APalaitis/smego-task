import * as React from 'react'
import { GenericInputProps, useGenericInput } from './useGenericInput'

export interface SelectInputProps extends GenericInputProps {
    options: string[]
}

export const SelectInput: React.FC<SelectInputProps> = props => {
    const {state, handleChangeEvent, handleBlurEvent, inputProps} = useGenericInput<HTMLSelectElement>({
        defaultValue: '',
        ...props
    })
    const options = props.options ?? [...Array(15)].map((_, index) => `Value #${index}`)

    return (
        <select
            {...inputProps}
            name={props.name}
            value={state.value}
            onChange={handleChangeEvent}
            onBlur={handleBlurEvent}
        >
            <option value={''}></option>
            {options?.map((option, index) => (
                <option value={option} key={`${index}_${option}`}>{option}</option>
            ))}
        </select>
    )
}