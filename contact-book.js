
let aside = document.querySelector('#aside');
let openbtn = document.querySelector('#openbtn');
let closebtn = document.querySelector('#closebtn');
let bgclose = document.querySelector('.bg')

openbtn.addEventListener('click', () => {
    aside.style.display = 'block';
    openbtn.style.display = 'none';
    bgclose.style.display = 'block'
    document.body.style.overflow = 'hidden';
});

closebtn.addEventListener('click', () => {
    aside.style.display = 'none';
    openbtn.style.display = 'block';
    bgclose.style.display = 'none'
    document.body.style.overflow = '';
});

bgclose.addEventListener('click',()=>{
    aside.style.display = 'none';
    openbtn.style.display = 'block';
    bgclose.style.display = 'none'
    document.body.style.overflow = '';
})