
const getData = async () => {
    try {
        const response = await fetch('https://dragonball-api.com/api/characters');
        if (!response.ok) {
            throw new Error('Erro na API');
        }
        const data = await response.json()
        console.log(data)
        return data        
    
    } catch(err) {
        console.log(err)
    }
}

const createCard = (data) => {
    const cardsContainer = document.getElementById('cards-container')
    const card = document.createElement('div')
    card.classList.add('card')
    card.id = `char-${data.id}`

    const imgSection = document.createElement('div')
    imgSection.classList.add('img-section')

    const img = document.createElement('img')
    img.src = data.image
    imgSection.appendChild(img)

    const infoSection = document.createElement('div')
    infoSection.classList.add('info-section')

    const cardTitle = document.createElement('div')
    cardTitle.classList.add('card-title')

    const charName = document.createElement('h3')
    charName.innerText = data.name

    const gender = data.gender.toLowerCase();
    const iconSrc = (gender === 'male' || gender === 'female') 
    ? `assets/icons/${gender}-gender.svg` 
    : `assets/icons/unknown-gender.svg`;
    const charGender = document.createElement('span'); 
    charGender.classList.add('char-gender');
    charGender.title = data.gender; 

    charGender.style.webkitMaskImage = `url(${iconSrc})`;
    charGender.style.maskImage = `url(${iconSrc})`;

    cardTitle.append(charName,charGender)

    const race = document.createElement('p')
    race.innerText = `Raça: ${data.race}`
    
    const charKi = document.createElement('p')
    charKi.innerText = `Ki: ${data.ki}`

    const totalKi = document.createElement('p')
    totalKi.innerText = `Total Ki: ${data.maxKi}`
    

    const detailsBtn = document.createElement('button')
    detailsBtn.innerText = "Detalhes"
    
    infoSection.append(cardTitle, race, charKi, totalKi, detailsBtn)

    card.append(imgSection,infoSection)
    cardsContainer.appendChild(card)
   
}

const renderCards =  (data) => {
    const chars = data.items
    chars.forEach(char => {
        createCard(char)
    })
}

const initApp = async () => {
    const data = await getData()
    renderCards(data)
}

initApp()

