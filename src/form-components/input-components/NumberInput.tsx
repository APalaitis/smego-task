import * as React from 'react'
import { GenericInputProps, useGenericInput } from './useGenericInput'

export interface NumberInputProps extends GenericInputProps {}

export const NumberInput: React.FC<NumberInputProps> = props => {
    const {state, handleChangeEvent, handleBlurEvent, inputProps} = useGenericInput<HTMLInputElement>({
        defaultValue: '',
        ...props
    })

    return (
        <input
            {...inputProps}
            type="number"
            name={props.name}
            value={state.value}
            onChange={handleChangeEvent}
            onBlur={handleBlurEvent}
        />
    )
}