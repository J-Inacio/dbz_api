const modal = document.getElementById('details-modal');
const btnCloseModal = document.getElementById('fechar-modal');
const mainChars = [
    "vegeta",   
    "goku",
    "gohan",
    "piccolo",
    "trunks",
    "freezer",
    "broly",
    "celula"
]

btnCloseModal.addEventListener('click', () => {
    modal.close();
});

let charsCount = 1
const moreCharsBtn = document.getElementById('more-chars')
const getMoreChars = async () => {

    if(charsCount >= 6) { 
        moreCharsBtn.style.backgroundColor = 'gray';
        moreCharsBtn.disabled = true;
        return;
    }

    moreCharsBtn.disabled = true
    moreCharsBtn.style.cursor = "not-allowed"
    charsCount ++

    try {
        const response = await fetch(`https://dragonball-api.com/api/characters?page=${charsCount}&limit=10`);
        if (!response.ok) {
            throw new Error('Erro na API');
        }
        const data = await response.json()
        console.log(data)
        renderCards(data)
        
    } catch(err) {
        console.log(err)
        charsCount--
    } finally {
        if (charsCount < 6) {
            moreCharsBtn.disabled = false;
            moreCharsBtn.style.cursor = "pointer";
        }
    }
   
}

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

const getDetails = async (id) => {
    try {
        const response = await fetch(`https://dragonball-api.com/api/characters/${id}`)
        const detailsData = await response.json()
        return detailsData
    } catch (err) {
        console.log(err)
    }
}

const buildModalContent = (characterData) => {

    const charName = characterData.name.toLowerCase();

    const mainCharImgSrc = mainChars.includes(charName) 
        ? `/assets/imgs/${charName}.gif`
        : "/assets/imgs/defaultDetails.jpg";
    
    let transformationsHtml = '';
    
    if (characterData.transformations && characterData.transformations.length > 0) {
        transformationsHtml = characterData.transformations.map(trans => `
            <div class="transformation-card">
                <img src="${trans.image}" alt="${trans.name}" class="transformation-img" />
                <h4>${trans.name}</h4>
                <p>Ki: ${trans.ki}</p>
            </div>
        `).join('');
    } else {
        transformationsHtml = '<p class="no-data">No transformations available.</p>';
    }

    const planetStatus = characterData.originPlanet.isDestroyed 
        ? '<span class="status-destroyed">(Destroyed)</span>' 
        : '<span class="status-active">(Active)</span>';

    return `
        <div class="modal-header">
            <h2 class="modal-title">${characterData.name}</h2>
            <button id="close-modal-btn" class="close-btn">&times;</button>
        </div>
        
        <div class="modal-body">
            <div class="modal-hero">
                <img src="${characterData.image}" alt="${characterData.name}" class="modal-main-img" />
                <div class="modal-stats">
                    <p><strong>Raça:</strong> ${characterData.race}</p>
                    <p><strong>Genero:</strong> ${characterData.gender}</p>
                    <p><strong>Grupo:</strong> ${characterData.affiliation}</p>
                    <p><strong>Base Ki:</strong> ${characterData.ki}</p>
                    <p><strong>Max Ki:</strong> ${characterData.maxKi}</p>
                </div>
            </div>

           
            <div class="charDetailsImg">
                <img src="${mainCharImgSrc}" alt="${charName} gif" class="mainChar-img" />
            </div>

            <div class="modal-section">
                <h3 class="details-titles">Sobre</h3>
                <p class="description-text">${characterData.description}</p>
            </div>

            <div class="modal-section">
                <h3 class="details-titles">Planeta de origem: ${characterData.originPlanet.name} ${planetStatus}</h3>
                <div class="planet-info">
                    <img src="${characterData.originPlanet.image}" alt="${characterData.originPlanet.name}" class="planet-img" />
                    <p class="description-text">${characterData.originPlanet.description}</p>
                </div>
            </div>

            <div class="modal-section">
                <h3 class="details-titles">Transformações</h3>
                <div class="transformations-grid">
                    ${transformationsHtml}
                </div>
            </div>
        </div>
    `;
};

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
    detailsBtn.addEventListener("click", async () => {
        try{
            modal.innerHTML = `<h2 style="color: var(--dbz-gold); text-align: center; padding: 2rem;">Elevando o Ki...</h2>`;
            modal.showModal();

            detailsBtn.disabled = true;
            detailsBtn.innerText = "Carregando...";
            detailsBtn.style.cursor = "not-allowed";

            const detailsData = await getDetails(data.id)

            modal.innerHTML = buildModalContent(detailsData)

            const newCloseBtn = document.getElementById('close-modal-btn');
            newCloseBtn.addEventListener('click', () => {
                modal.close();
            });

        } catch (error) {
        console.error("Error fetching character details:", error);
        modal.innerHTML = `
                <div style="padding: 2rem; text-align: center;">
                    <h2 style="color: var(--dbz-red);">Failed to load character data.</h2>
                    <button id="close-error-btn" class="close-btn">Close</button>
                </div>
            `;
    }   finally {
            detailsBtn.disabled = false;
            detailsBtn.innerText = "Detalhes";
            detailsBtn.style.cursor = "pointer";
    }

       
    });
    
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
    moreCharsBtn.addEventListener('click', getMoreChars)
}

initApp()

