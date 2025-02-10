import { Home } from '../../pages/Home/Home'
import { LoginRegister } from '../../pages/LoginRegister/LoginRegister'
import './Header.css'

const routes = [
  {
    text: 'Home',
    funcion: Home
  },
  {
    text: 'Login',
    funcion: LoginRegister
  }
]

export const Header = () => {
  const header = document.querySelector('header')
  header.innerHTML = ''
  const nav = document.createElement('nav')

  for (const route of routes) {
    const a = document.createElement('a')
    a.href = '#'

    if (route.text === 'Login') {
      if (!localStorage.getItem('token')) {
        a.textContent = 'Login'
        a.addEventListener('click', route.funcion)
      } else {
        a.textContent = 'Logout'
        a.addEventListener('click', () => {
          localStorage.removeItem('token')
          Header()
        })
      }
    } else {
      a.textContent = route.text
      a.addEventListener('click', route.funcion)
    }

    nav.append(a)
  }

  header.append(nav)
}
