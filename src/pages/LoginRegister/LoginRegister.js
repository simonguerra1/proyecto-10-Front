import './LoginRegister.css'
import { Home } from '../Home/Home'
import { Header } from '../../components/Header/Header'

export const LoginRegister = () => {
  const main = document.querySelector('main')
  main.innerHTML = ''

  const loginDiv = document.createElement('div')

  Login(loginDiv)

  loginDiv.id = 'login'

  main.append(loginDiv)
}

const Login = (elementoPadre) => {
  const form = document.createElement('form')

  const inputUserName = document.createElement('input')
  const inputPassword = document.createElement('input')
  const button = document.createElement('button')

  inputPassword.type = 'password'
  inputUserName.placeholder = 'Nombre de usuario'
  inputPassword.placeholder = 'Contraseña'
  button.textContent = 'Login'
  button.type = 'submit'

  elementoPadre.append(form)
  form.append(inputUserName)
  form.append(inputPassword)
  form.append(button)

  form.addEventListener('submit', () =>
    submit(inputUserName.value, inputPassword.value)
  )
}

const submit = async (userName, password) => {
  const objetoFinal = JSON.stringify({
    userName: userName.trim(),
    password: password.trim()
  })

  const opciones = {
    method: 'POST',
    body: objetoFinal,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  }

  try {
    const res = await fetch(
      'http://localhost:3000/api/v1/users/login',
      opciones
    )

    const errorExistente = document.querySelector('#error-message')
    if (errorExistente) {
      errorExistente.remove()
    }

    if (!res.ok) {
      const errorData = await res.json()

      console.error('Error en la petición:', res.status, errorData.error)

      // mensaje de error
      const pError = document.createElement('p')
      pError.classList.add('error')
      pError.textContent = errorData.error || 'Error desconocido'
      pError.style.color = 'red'

      const form = document.querySelector('form')
      if (form) {
        form.appendChild(pError)
      }
      return
    }

    const respuestaFinal = await res.json()
    console.log('Respuesta del backend:', respuestaFinal)

    if (respuestaFinal.token) {
      localStorage.setItem('token', respuestaFinal.token)
      localStorage.setItem('user', JSON.stringify(respuestaFinal.user))
      const main = document.querySelector('main')
      main.innerHTML = ''
      Home()
      Header()
    } else {
      console.error('No se recibió un token, login fallido.')
    }

    return respuestaFinal
  } catch (error) {
    console.error('Error al enviar la solicitud:', error)
  }
}
