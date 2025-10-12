import React, { PropsWithChildren } from 'react';
import { Field, ErrorMessage } from 'formik';
import TextError from './TextError';

function Input(props: any) {
  const { label, name, ...rest } = props;
  return (
    <>
      <label htmlFor={name}>{label}</label>
      <Field id={name} name={name} {...rest} />
      <ErrorMessage name={name} component={TextError} />
    </>
  );
}

export default Input;