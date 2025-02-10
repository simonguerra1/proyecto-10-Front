import './Home.css'

export const Home = async () => {
  const main = document.querySelector('main')

  const res = await fetch('http://localhost:3000/api/v1/eventos')

  const eventos = await res.json()

  pintarEventos(eventos, main)
}

const pintarEventos = (eventos, elementoPadre) => {
  for (const evento of eventos) {
    const divEvento = document.createElement('div')
    const titulo = document.createElement('h3')
    const img = document.createElement('img')
    const fecha = document.createElement('p')
    const ubicacion = document.createElement('p')
    const descripcion = document.createElement('p')

    const interesado = document.createElement('img')
    interesado.src = '/assets/no-interesado.png'
    interesado.className = 'interesado'
    interesado.setAttribute('data-id', evento._id)

    interesado.addEventListener('click', () => {
      if (interesado.src.includes('no-interesado.png')) {
        addInteresado(evento._id).then(() => {
          interesado.src = '/assets/interesado.png'
        })
      } else {
        deleteInteresado(evento._id).then(() => {
          interesado.src = '/assets/no-interesado.png'
        })
      }
    })

    divEvento.className = 'evento'
    titulo.textContent = evento.titulo
    img.src = evento.img
    fecha.textContent = evento.fecha
    ubicacion.textContent = evento.ubicacion
    descripcion.textContent = evento.descripcion

    divEvento.append(titulo, fecha, img, descripcion, ubicacion, interesado)
    elementoPadre.append(divEvento)

    console.log(evento)
  }
}

const addInteresado = async (idEvento) => {
  const user = JSON.parse(localStorage.getItem('user'))
  const token = localStorage.getItem('token')

  if (!user || !user._id || !token) {
    console.error('Error: No se encontró el usuario o token en localStorage.')
    return
  }

  try {
    const res = await fetch(
      `http://localhost:3000/api/v1/users/${user._id}/add-interested/${idEvento}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    )

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || 'Error al marcar evento como interesado')
    }

    const iconoInteresado = document.querySelector(
      `.interesado[data-id="${idEvento}"]`
    )

    if (iconoInteresado) {
      iconoInteresado.src = '/assets/interesado.png'
      console.log('Icono de interesado actualizado.')
    } else {
      console.warn('No se encontró el icono de interesado para este evento.')
    }

    console.log('Evento agregado a interesados:', data)
  } catch (error) {
    console.error('Error al agregar evento a interesados:', error)
  }
}

const deleteInteresado = async (idEvento) => {
  const user = JSON.parse(localStorage.getItem('user'))
  const token = localStorage.getItem('token')

  if (!user || !user._id || !token) {
    console.error('Error: No se encontró el usuario o token en localStorage.')
    return
  }

  try {
    const res = await fetch(
      `http://localhost:3000/api/v1/users/${user._id}/remove-interested/${idEvento}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    )

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || 'Error al eliminar evento de interesados')
    }

    const iconoInteresado = document.querySelector(
      `.interesado[data-id="${idEvento}"]`
    )

    if (iconoInteresado) {
      iconoInteresado.src = '/assets/no-interesado.png'
      console.log('Icono de no-interesado actualizado.')
    } else {
      console.warn('No se encontró el icono de interesado para este evento.')
    }

    console.log('Evento eliminado de interesados:', data)
  } catch (error) {
    console.error('Error al eliminar evento de interesados:', error)
  }
}
