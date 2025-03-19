import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import styles from './App.module.css'

const fieldsSchema = yup.object()
.shape({
  email: yup.string()
  .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Некорректный формат email.'),
  password: yup.string()
  .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]).{8,}$/, 
    'Пароль должен содержать минимум 8 символов, одну заглавную букву, одну цифру и один специальный символ.'
  ),
  checkPassword: yup.string()
  .oneOf([yup.ref('password'), null], 'Пароли должны совпадать')
})

export const App = () => {
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
} = useForm({
    defaultValues: {
        email: '',
        password: '',
        checkPassword: '',
    },
    resolver: yupResolver(fieldsSchema),
    mode: 'onBlur',
})

const handleReset = () => {
  reset({ email: '', password: '', checkPassword: '',})
  clearErrors()
}

const emailError = errors.email?.message
const passwordError = errors.password?.message
const checkPasswordError = errors.checkPassword?.message

  const sendFormData = (formData) => {
    console.log(formData)
  }

  return (
    <div className={styles.app}>
      <h1>Регистрация</h1>
      <form className={styles.form} onSubmit={handleSubmit(sendFormData)}>
        
          <input className={`${styles['input-email']} ${styles.input}`}
            name="email"
            type="text"
            {...register('email')}
            placeholder="Почта"
          />
          <div className={styles['other-input']}>
          <input className={`${styles['input-login']} ${styles.input}`}
            name="password"
            type="password"
            {...register('password')}
            placeholder="Пароль"
          />
        <input className={`${styles['input-password']} ${styles.input}`}
          disabled={errors.password}
          name="checkPassword"
          type="password"
          {...register('checkPassword')}
          placeholder="Повтор Пароля"
        />
        </div>
      <div className={styles.btns}>
        <button 
         className={styles['glow-on-hover']}
         type="submit" 
         disabled={!!emailError || !!passwordError}
         >
          Зарегистрироваться
        </button>
        <button className={styles['glow-on-hover']} onClick={handleReset}>Сброс</button>
      </div>
      </form>
      <div>
      {checkPasswordError && <div className={styles.errorLabel}>{checkPasswordError}</div>}
      {emailError && <div className={styles.errorLabel}>{emailError}</div>}
      {passwordError && (<div className={styles.errorLabel}>{passwordError}</div>)}
      </div>
    </div>
  )
}