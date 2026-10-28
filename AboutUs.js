let aside = document.querySelector('#aside')
let openbtn = document.querySelector('#openbtn')
let closebtn = document.querySelector('#closebtn')

openbtn.addEventListener('click',(e)=>{
    aside.style.display = 'block'
    openbtn.style.display = 'none'
})

closebtn.addEventListener('click',(e)=>{
    aside.style.display = 'none'
    openbtn.style.display = 'block'
})

