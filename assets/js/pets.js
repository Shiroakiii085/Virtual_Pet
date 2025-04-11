// assets/js/pets.js
// Pet drawing functions
function drawCat(element) {
    const cat = document.createElement('div');
    cat.innerHTML = `
        <div class="w-full h-full relative">
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-16">
                <div class="absolute w-18 h-14 bg-amber-200 dark:bg-amber-300 rounded-full top-2 left-1"></div>
                <div class="absolute top-0 left-0 w-8 h-8 bg-amber-200 dark:bg-amber-300 rounded-full transform -translate-x-1/4 translate-y-1/4 flex items-center justify-center">
                    <div class="w-4 h-4 bg-black/80 rounded-full"></div>
                </div>
                <div class="absolute top-0 right-0 w-8 h-8 bg-amber-200 dark:bg-amber-300 rounded-full transform translate-x-1/4 translate-y-1/4 flex items-center justify-center">
                    <div class="w-4 h-4 bg-black/80 rounded-full"></div>
                </div>
                <div class="absolute top-8 left-1/2 -translate-x-1/2 w-3 h-2 bg-pink-300 dark:bg-pink-400 rounded-full"></div>
                <div class="absolute top-6 left-1/2 -translate-x-1/2 w-4 h-4 bg-pink-50 dark:bg-pink-100 rounded-full"></div>
                <div class="absolute top-12 left-1/2 -translate-x-1/2 w-6 h-1 flex items-center space-x-1">
                    <div class="w-1 h-3 bg-black transform -translate-y-0.5 rotate-12"></div>
                    <div class="w-1 h-3 bg-black transform -translate-y-0.5 -rotate-12"></div>
                </div>
            </div>
            <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-10 bg-amber-200 dark:bg-amber-300 rounded-full"></div>
        </div>
    `;
    element.innerHTML = '';
    element.appendChild(cat);
}

function drawRabbit(element) {
    const rabbit = document.createElement('div');
    rabbit.innerHTML = `
        <div class="w-full h-full relative">
            <div class="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-16">
                <div class="absolute w-16 h-16 bg-gray-100 dark:bg-gray-200 rounded-full"></div>
                <div class="absolute top-0 left-0 w-6 h-12 bg-gray-100 dark:bg-gray-200 rounded-full transform -translate-x-1/2 -translate-y-3/4 -rotate-12"></div>
                <div class="absolute top-0 right-0 w-6 h-12 bg-gray-100 dark:bg-gray-200 rounded-full transform translate-x-1/2 -translate-y-3/4 rotate-12"></div>
                <div class="absolute top-4 left-1/4 w-3 h-3 bg-pink-200 dark:bg-pink-300 rounded-full"></div>
                <div class="absolute top-4 right-1/4 w-3 h-3 bg-pink-200 dark:bg-pink-300 rounded-full"></div>
                <div class="absolute top-8 left-1/2 -translate-x-1/2 w-2 h-2 bg-pink-300 dark:bg-pink-400 rounded-full"></div>
                <div class="absolute top-6 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-gray-50 rounded-full"></div>
                <div class="absolute top-10 left-1/2 -translate-x-1/2 w-4 h-1 flex items-center space-x-1">
                    <div class="w-1 h-2 bg-black"></div>
                    <div class="w-1 h-2 bg-black"></div>
                </div>
            </div>
            <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-8 bg-gray-100 dark:bg-gray-200 rounded-full"></div>
        </div>
    `;
    element.innerHTML = '';
    element.appendChild(rabbit);
}

function drawDinosaur(element) {
    const dino = document.createElement('div');
    dino.innerHTML = `
        <div class="w-full h-full relative">
            <div class="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-14">
                <div class="absolute w-14 h-12 bg-green-300 dark:bg-green-400 rounded-full top-1 left-1"></div>
                <div class="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-3 flex justify-around">
                    <div class="w-2 h-3 bg-green-300 dark:bg-green-400 rounded-sm"></div>
                    <div class="w-2 h-4 bg-green-300 dark:bg-green-400 rounded-sm"></div>
                    <div class="w-2 h-2 bg-green-300 dark:bg-green-400 rounded-sm"></div>
                </div>
                <div class="absolute top-4 left-1/4 w-3 h-3 bg-white dark:bg-gray-50 rounded-full flex items-center justify-center">
                    <div class="w-2 h-2 bg-black rounded-full"></div>
                </div>
                <div class="absolute top-4 right-1/4 w-3 h-3 bg-white dark:bg-gray-50 rounded-full flex items-center justify-center">
                    <div class="w-2 h-2 bg-black rounded-full"></div>
                </div>
                <div class="absolute top-8 left-1/2 -translate-x-1/2 w-5 h-2 bg-green-400 dark:bg-green-500 rounded-full"></div>
            </div>
            <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-8 bg-green-300 dark:bg-green-400 rounded-t-lg"></div>
        </div>
    `;
    element.innerHTML = '';
    element.appendChild(dino);
}

function drawPanda(element) {
    const panda = document.createElement('div');
    panda.innerHTML = `
        <div class="w-full h-full relative">
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-16">
                <div class="absolute w-16 h-14 bg-white dark:bg-gray-100 rounded-full top-1 left-2"></div>
                <div class="absolute top-0 left-0 w-8 h-8 bg-black rounded-full transform -translate-x-1/4 translate-y-1/4 flex items-center justify-center">
                    <div class="w-4 h-4 bg-white dark:bg-gray-100 rounded-full"></div>
                </div>
                <div class="absolute top-0 right-0 w-8 h-8 bg-black rounded-full transform translate-x-1/4 translate-y-1/4 flex items-center justify-center">
                    <div class="w-4 h-4 bg-white dark:bg-gray-100 rounded-full"></div>
                </div>
                <div class="absolute top-8 left-1/2 -translate-x-1/2 w-3 h-2 bg-black rounded-full"></div>
                <div class="absolute top-10 left-1/2 -translate-x-1/2 w-6 h-1 flex items-center space-x-1">
                    <div class="w-1 h-2 bg-black"></div>
                    <div class="w-1 h-2 bg-black"></div>
                </div>
            </div>
            <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-10 bg-black rounded-full"></div>
        </div>
    `;
    element.innerHTML = '';
    element.appendChild(panda);
}

function drawDog(element) {
    const dog = document.createElement('div');
    dog.innerHTML = `
        <div class="w-full h-full relative">
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-16">
                <div class="absolute w-16 h-14 bg-amber-600 dark:bg-amber-700 rounded-full top-1 left-2"></div>
                <div class="absolute top-0 left-0 w-7 h-5 bg-amber-600 dark:bg-amber-700 rounded-full transform -translate-x-1/2 rotate-20"></div>
                <div class="absolute top-0 right-0 w-7 h-5 bg-amber-600 dark:bg-amber-700 rounded-full transform translate-x-1/2 -rotate-20"></div>
                <div class="absolute top-4 left-1/4 w-3 h-3 bg-black rounded-full"></div>
                <div class="absolute top-4 right-1/4 w-3 h-3 bg-black rounded-full"></div>
                <div class="absolute top-8 left-1/2 -translate-x-1/2 w-4 h-3 bg-black rounded-full"></div>
                <div class="absolute top-10 left-1/2 -translate-x-1/2 w-6 h-2 bg-pink-300 dark:bg-pink-400 rounded"></div>
            </div>
            <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-8 bg-amber-600 dark:bg-amber-700 rounded-full"></div>
        </div>
    `;
    element.innerHTML = '';
    element.appendChild(dog);
}

function drawBird(element) {
    const bird = document.createElement('div');
    bird.innerHTML = `
        <div class="w-full h-full relative">
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16">
                <div class="absolute w-16 h-14 bg-red-400 dark:bg-red-500 rounded-full top-1 left-0"></div>
                <div class="absolute top-4 left-1/4 w-3 h-3 bg-black rounded-full"></div>
                <div class="absolute top-4 right-1/4 w-3 h-3 bg-black rounded-full"></div>
                <div class="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-2 bg-red-500 dark:bg-red-600"></div>
                <div class="absolute top-6 left-1/2 -translate-x-1/2 transform rotate-20 w-6 h-4 bg-yellow-400 dark:bg-yellow-500" style="clip-path: polygon(0% 50%, 50% 0%, 100% 50%, 50% 100%);"></div>
            </div>
            <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-6 bg-red-400 dark:bg-red-500 rounded-full"></div>
        </div>
    `;
    element.innerHTML = '';
    element.appendChild(bird);
}

function drawFish(element) {
    const fish = document.createElement('div');
    fish.innerHTML = `
        <div class="w-full h-full relative pet-float">
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-12">
                <div class="absolute w-16 h-10 bg-orange-400 dark:bg-orange-500 rounded-full top-1 left-0"></div>
                <div class="absolute top-1 right-0 w-8 h-10 bg-orange-400 dark:bg-orange-500" style="clip-path: polygon(0% 0%, 0% 100%, 100% 50%);"></div>
                <div class="absolute top-3 left-4 w-3 h-3 bg-white dark:bg-gray-100 rounded-full">
                    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-black rounded-full"></div>
                </div>
                <div class="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-4 bg-orange-500 dark:bg-orange-600" style="clip-path: polygon(50% 0%, 0% 100%, 100% 100%);"></div>
            </div>
        </div>
    `;
    element.innerHTML = '';
    element.appendChild(fish);
}

function drawHamster(element) {
    const hamster = document.createElement('div');
    hamster.innerHTML = `
        <div class="w-full h-full relative">
            <div class="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-14">
                <div class="absolute w-16 h-14 bg-amber-300 dark:bg-amber-400 rounded-full"></div>
                <div class="absolute top-3 left-1/4 w-3 h-3 bg-black rounded-full"></div>
                <div class="absolute top-3 right-1/4 w-3 h-3 bg-black rounded-full"></div>
                <div class="absolute top-0 left-0 w-4 h-4 bg-amber-300 dark:bg-amber-400 rounded-full transform -translate-x-1/3 -translate-y-1/4"></div>
                <div class="absolute top-0 right-0 w-4 h-4 bg-amber-300 dark:bg-amber-400 rounded-full transform translate-x-1/3 -translate-y-1/4"></div>
                <div class="absolute top-7 left-1/2 -translate-x-1/2 w-5 h-3 bg-pink-200 dark:bg-pink-300 rounded-full"></div>
                <div class="absolute top-6 left-1/2 -translate-x-1/2 w-6 h-2 flex justify-around items-center">
                    <div class="w-1 h-2 bg-black rounded-full"></div>
                    <div class="w-1 h-2 bg-black rounded-full"></div>
                </div>
            </div>
            <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-6 bg-amber-300 dark:bg-amber-400 rounded-full"></div>
        </div>
    `;
    element.innerHTML = '';
    element.appendChild(hamster);
}

function getPetDrawFunction(petIndex) {
    switch (petIndex) {
        case 0: return drawCat;
        case 1: return drawRabbit;
        case 2: return drawDinosaur;
        case 3: return drawPanda;
        case 4: return drawDog;
        case 5: return drawBird;
        case 6: return drawFish;
        case 7: return drawHamster;
        default: return drawCat;
    }
}