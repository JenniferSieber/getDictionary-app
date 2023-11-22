const getDefinitionBtn = document.querySelector('.get-definition')
const main = document.querySelector('.main')
const wordResultsContainer = document.querySelector('.word-results')
const wordResult = wordResultsContainer.querySelector('.word-result')
const wordH2 = wordResultsContainer.querySelector('.word')
const sourceLink = document.querySelector('.source-link')
const wordMeaningsContainer = wordResultsContainer.querySelector('.word-meanings')
const wordMeaningsUL = wordMeaningsContainer.querySelector('ul')
const mp3Button = document.querySelector('.word-mp3-button')
const clearPage = document.querySelector('.clear-page')

let wordObj = null
let wordMeanings = null
let wordPhonetics = null
let audio = null
let audioMP3 = ''
let mp3Link = null
getDefinitionBtn.addEventListener('click', getFetch)

function getFetch(){
  clearDynamicElements() 
  main.classList.remove('hidden')
  const wordToDefine = (document.querySelector('.word').value).toLowerCase()
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${wordToDefine}`
  fetch(url)
    .then(res => res.json())
    .then(data => {
      wordObj = data[0]
      wordResults(wordObj)
    })
    .catch(err => {
      console.log(`Error ${err}`)
    })
}

function wordResults(wordObj) {
  let wordMeaningArr = wordObj.meanings
  wordMeanings = wordMeaningArr
  let wordPhoneticsArr = wordObj.phonetics 
  wordPhonetics = wordPhoneticsArr
  audioMP3 = ''
  wordPhoneticsArr.forEach(el => {
    if (el.audio != '') {
      audioMP3 = el.audio
    }
  })
  displayWordResults()
}

function displayWordResults() {
  console.log(wordObj)
  const wordResult = wordResultsContainer.querySelector('.word-result')
  const sourceContainer = document.querySelector('.source-container')
  sourceLink.classList.remove('hidden')
  wordResult.textContent = wordObj.word
  clearPage.classList.remove('hidden')
  
  sourceLink.textContent = wordObj.phonetic
  sourceLink.href = wordObj.sourceUrls[0]
  sourceLink.target = '_blank'
  
  displayMeaning()
  if (audioMP3 != '') {
    mp3ButtonActivate()
  } 
}

function displayMeaning() {
  console.log(wordMeanings)
  let partOfSpeechArr = null;
  let definitionsArr = null
  let synonymsArr = null
  let definitionsStr = ''
  let synonymsStr = ''

  wordMeanings.forEach(meaning => {
    //Part of speech
    partOfSpeechArr = meaning.partOfSpeech
    let h4Element = document.createElement('h4')
    h4Element.textContent = ` ${meaning.partOfSpeech.toUpperCase()}:  `
    wordMeaningsContainer.appendChild(h4Element)

    // definition for that part of speech
    definitionsArr = meaning.definitions
    if (definitionsArr != []) {
      definitionsStr = definitionsArr.map(el => el.definition).join(' ')
    }

    let pElement = document.createElement('p')
    pElement.textContent =` ${definitionsStr} `
    wordMeaningsContainer.appendChild(pElement)
      
    // synonyms from part of speech
    synonymsArr = meaning.synonyms
    if (synonymsArr != []) {
      synonymsStr = synonymsArr.map(el => el).join(', ')
    } 
    if (synonymsStr != '') {
      let spanElement = document.createElement('span')
      spanElement.textContent = `Synonyms:  ${synonymsStr}`
      wordMeaningsContainer.appendChild(spanElement)
    }
  })
}

function mp3ButtonActivate() {
  mp3Link = ''
  audio = null
  mp3Button.classList.remove('hidden')
  mp3Link = `${audioMP3}`
  audio = new Audio(mp3Link)
  mp3Button.addEventListener('click', e => {
    audio.play()
  })
}

function clearDynamicElements() {
  wordObj = null
  wordMeanings = null
  wordPhonetics = null
  wordResult.textContent = ''
  wordMeaningsContainer.innerHTML = ''
  main.classList.add('hidden')
  sourceLink.classList.add('hidden')
  sourceLink.textContent = ''
  sourceLink.href = ''
  mp3Button.classList.add('hidden')
  audioMP3 = ''
  mp3Link = null
  clearPage.classList.add('hidden')
}

clearPage.addEventListener('click', clearDynamicElements)

