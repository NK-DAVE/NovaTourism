document.getElementById("play-video").addEventListener("click", function (event) {
    const videoContainer = document.getElementById("video-container");
    videoContainer.style.display = "block";
    const video = document.getElementById("my-video");
    event.stopPropagation()
    video.play();
});

// Fermer la vidéo en cliquant en dehors
document.addEventListener("click", function(event) {
    const videoContainer = document.getElementById("video-container");
    if (event.currentTarget !== videoContainer && !videoContainer.contains(event.target) && event.currentTarget !== document.getElementById("play-video")) {
        videoContainer.style.display = "none";
        const video = document.getElementById("my-video");
        video.pause();
    }
});

/***********************************Effet de scroll ***********************************/
//variable qui détermine le pourcentage de l'element visible afin qui soit considérer comme visible
const ratio = 0.6
let observer = null
/**
 * @param {*HTMLElement} elemen 
 */
const activate = function (elem) {
    const id = elem.getAttribute('id')
    const anchor = document.querySelector(`a[href="#${id}"]`)

    if (anchor === null) {
        return null
    }
    anchor.parentElement
        .querySelectorAll('.active')
        .forEach(node => node.classList.remove('active'))
    anchor.classList.add('active')
}

/**
 * @param {IntersectionObserverEntry[]} entries
 * @param {IntersectionObserver} observer
 */
const callback = function (entries) {
    entries.forEach(function (entry) {
        if (entry.intersectionRatio > 0) {
            activate(entry.target)
        }
    })
}

const spies = document.querySelectorAll('section')
/**
 * @param {NodeListOf, <HTMLElement>} elems
 */
const observe = function (elems) {
    if (observer !== null) {
        elems.forEach(elem => observer.unobserve(elem))
    }
    const y = Math.round(window.innerHeight * ratio)
    observer = new IntersectionObserver(callback, {
        rootMargin: `-${window.innerHeight - y - 1}px 0px -${y}px 0px`
    })
    spies.forEach(elem => observer.observe(elem))
}

/**
 * @param {Function} callback
 * @param {number} delay
 * @return {Function}
 */
const debounce = function (callback, delay) {
    let timer
    return function () {
        let args = arguments
        let context = this;
        clearTimeout(timer)
        timer = setTimeout(function () {
            callback.apply(context, args)
        }, delay)
    }
}

if (spies.length > 0) {
    observe(spies)
    let windowH = window.innerHeight
    window.addEventListener('resize', debounce(function () {
        if (window.innerHeight !== windowH) {
            observe(spies)
            windowH = window.innerHeight
        }
    }, 500))
}

/*********************************************CAROUSEL***************************************/
class Carousel {
    /**
     * @callback  moveCallbacks
     * @param {number} index
     */

    /**
     * @param {HTMLElement} element 
     * @param {object} options 
     * @param {object} options.slidesToScroll == 1 par defaut qui permet de préciser le nombre d'élément a faire dédiler
     * @param {object} options.slidesVisible == 3 par defaut qui permet de préciser le nombre d'élément visible dans un slide
     * @param {boolean} options.loop == false doit on bouclé en fin de carousel
     * @param {boolean} options.infinite == false
     * @param {boolean} options.pagination == false
     * @param {boolean} options.navigation == true
     */
    constructor(element, options = {}) {
        this.element = element
        this.options = Object.assign({}, {
            slidesToScroll: 1,
            slidesVisible: 1,
            loop: false,
            pagination: false,
            navigation: true,
            infinite: false
        }, options)
        if (this.options.loop && this.options.infinite) {
            throw new Error("Un caroussel n epeut être à la fois en boucle et en infini");
        }
        let children = [].slice.call(element.children)
        this.isMobile = false
        this.currentItem = 0
        this.moveCallbacks = []
        this.offset = 0

        //Modification du DOM
        this.root = this.CreateDivWithClass('carousel')
        this.container = this.CreateDivWithClass('carousel__panorama')
        this.root.setAttribute('tabindex', '0')
        this.root.appendChild(this.container)
        this.element.appendChild(this.root)
        this.items = children.map((child) => {
            let item = this.CreateDivWithClass('carousel__item')
            item.appendChild(child)
            return item
        })
        if (this.options.infinite) {
            this.offset = this.options.slidesVisible + this.options.slidesToScroll
            if (this.offset > children.length) {
                console.error("Vous n'avez pas assez d'élément dans le caroussel", element);
            }
            this.items = [
                ...this.items.slice(this.items.length - this.offset).map(item => item.cloneNode(true)),
                ...this.items,
                ...this.items.slice(0, this.offset).map(item => item.cloneNode(true))
            ]
            this.gotoItem(this.offset, false)
        }
        this.items.forEach(item => this.container.appendChild(item))

        this.setStyle()
        if (this.options.navigation) {
            this.createNavigation()
        }
        if (this.options.pagination) {
            this.createPagination()
        }

        // Evenement
        this.moveCallbacks.forEach(cb => cb(this.currentItem))
        this.onWindowResize()
        window.addEventListener('resize', this.onWindowResize.bind(this))
        this.root.addEventListener('keyup', e => {
            if (e.key === 'ArrowRight' || e.key === 'Right') {
                this.next()
            } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
                this.prev()
            }
        })
        if (this.options.infinite) {
            this.container.addEventListener('transitionend', this.resetInfinite.bind(this))
        }
    }

    /**
     * Applique les bonnes dimensions aus elemants du carousel
     */
    setStyle() {
        let ratio = this.items.length / this.slidesVisible
        this.container.style.width = `${ratio * 100}%`
        this.items.forEach(item => item.style.width = ((100 / this.slidesVisible) / ratio) + "%")
    }

    /**
     * Créer les flêches de navigation dans le DOM
     */
    createNavigation() {
        let nextButton = this.CreateDivWithClass('carousel__next')
        let prevButton = this.CreateDivWithClass('carousel__prev')
        this.root.appendChild(nextButton)
        this.root.appendChild(prevButton)
        nextButton.addEventListener('click', this.next.bind(this))
        prevButton.addEventListener('click', this.prev.bind(this))
        if (this.options.loop === true) {
            return
        }
        this.onMove(index => {
            if (index === 0) {
                prevButton.classList.add('carousel__prev__hidden')
            } else {
                prevButton.classList.remove('carousel__prev__hidden')
            }

            if (this.items[this.currentItem + this.slidesVisible] === undefined) {
                nextButton.classList.add('carousel__next__hidden')
            } else {
                nextButton.classList.remove('carousel__next__hidden')
            }
        })
    }

    /**
     * Permet de créer le système de pagination dans le DOM
     */
    createPagination() {
        let pagination = this.CreateDivWithClass('carousel__pagination')
        let buttons = []
        this.root.appendChild(pagination)
        for (let i = 0; i < (this.items.length - 2 * this.offset); i = i + this.options.slidesToScroll) {
            let button = this.CreateDivWithClass('carousel__pagination__button')
            button.addEventListener('click', () => this.gotoItem(i + this.offset))
            pagination.appendChild(button)
            buttons.push(button)
        }
        this.onMove(index => {
            let count = this.items.length - 2 * this.offset
            let activeButton = buttons[Math.floor(((index - this.offset) % count) / this.options.slidesToScroll)]
            if (activeButton) {
                buttons.forEach(button => button.classList.remove('carousel__pagination__button__active'))
                activeButton.classList.add('carousel__pagination__button__active')
            }
        })
    }

    next() {
        this.gotoItem(this.currentItem + this.slidesToScroll)
    }

    prev() {
        this.gotoItem(this.currentItem - this.slidesToScroll)
    }

    /**
     * Dirirge le carousel vers la cible
     * @param {number} index 
     * @param {boolean} animation = true 
     */
    gotoItem(index, animation = true) {
        if (index < 0) {
            if (this.options.length) {
                index = this.items.length - this.slidesVisible
            } else {
                return
            }
        } else if (index >= this.items.length || this.items[this.currentItem + this.slidesVisible] === undefined && index > this.currentItem) {
            if (this.options.loop) {
                index = 0
            } else {
                return
            }
        }
        let translateX = index * -100 / this.items.length
        if (animation === false) {
            this.container.style.transform = 'none'
        }
        this.container.style.transform = "translate3d(" + translateX + "%, 0, 0)"
        this.container.offsetHeight
        if (animation === false) {
            this.container.style.transform = ''
        }
        this.currentItem = index
        this.moveCallbacks.forEach(cb => cb(index))
    }

    /**
     * Elle va déplacer le container pour donner l'impression d'un slide infini
     */
    resetInfinite() {
        if (this.currentItem <= this.options.slidesToScroll) {
            this.gotoItem(this.currentItem + this.items.length - 2 * this.offset, false)
            /**
             * 1 2 3 4 5 6 7
             * 3 4 5 6 7 | 1 2 3 4 5 6 7 | 1 2 3 4 5
             */
        } else if (this.currentItem >= this.items.length - this.offset) {
            this.gotoItem(this.currentItem - (this.items.length - 2 * this.offset), false)
        }
    }

    /**
     * @param {moveCallbacks} cb 
     */
    onMove(cb) {
        this.moveCallbacks.push(cb)
    }

    onWindowResize() {
        let mobile = window.innerWidth < 800
        if (mobile !== this.isMobile) {
            this.isMobile = mobile
            this.setStyle()
            this.moveCallbacks.forEach(cb => cb(this.currentItem))
        }
    }

    /**
     * 
     * @param {String} className 
     * @returns {HTMLElement}
     */
    CreateDivWithClass(className) {
        let div = document.createElement('div')
        div.setAttribute('class', className)
        return div
    }


    /**
     * @returns {number}
     */
    get slidesToScroll() {
        return this.isMobile ? 1 : this.options.slidesToScroll
    }
    /**
     * @returns {number}
     */
    get slidesVisible() {
        return this.isMobile ? 1 : this.options.slidesVisible
    }

}

let onReady = function () {

    const carouselDestinations = document.querySelector("#carousel_destinations");
    const carouselBoxList = document.querySelector("#carousel_box-list");

    if (carouselDestinations) {
        new Carousel(carouselDestinations, {
            slidesVisible: 4,
            slidesToScroll: 1,
            pagination: true,
            loop: true
        });
    }

    if (carouselBoxList) {
        new Carousel(carouselBoxList, {
            slidesVisible: 3,
            slidesToScroll: 1,
            pagination: true,
            loop: true
        });
    }
}

onReady()

/*****************************************ZOOM SUR L'IMAGE******************************************/
const images = document.querySelectorAll('.image')
const detail = document.getElementById('details');
const closeImage = document.getElementById('close-image');

images.forEach(image => {
    image.addEventListener('click', (event) => {
        if (event.target.closest('button, a')) {
            return
        }

        const img = image.querySelector('.img').src
        const title = image.querySelector('.title_desc').textContent
        const desc = image.querySelector('.text_desc').textContent

        detail.style.display = 'flex'

        document.getElementById('image-detail').src = img
        document.getElementById('detail-title').textContent = title
        document.getElementById('text-desc').textContent = desc
    })
})

// Fermer l'image en grand
closeImage.addEventListener('click', () => {
    detail.style.display = 'none';
});

// Fermer l'image en grand en cliquant en dehors de l'image
detail.addEventListener('click', (e) => {
    if (e.target === detail) {
        detail.style.display = 'none';
    }
});

/*******************************************GESTION DU MENU SUR MOBILE ****************************************/
const deploy = document.getElementById('deploy')
const nav = document.querySelector('nav')

deploy.addEventListener('click', () => {
    nav.classList.toggle('nav_mobile')
    console.log(nav.classList)
})


document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function () {
        nav.classList.remove('nav_mobile')
    })
})

const bookingSection = document.getElementById('booking')
const bookingDestination = document.getElementById('booking-destination')
const bookingForm = document.getElementById('booking-form')
const bookingStatus = document.getElementById('booking-status')

document.querySelectorAll('.button-description button').forEach(button => {
    button.addEventListener('click', () => {
        const destination = button.closest('.box').querySelector('.title_desc').textContent.trim()
        bookingDestination.value = destination
        bookingSection.scrollIntoView({ behavior: 'smooth' })
    })
})

bookingForm.addEventListener('submit', event => {
    event.preventDefault()
    bookingStatus.textContent = 'Votre demande est prête. Ce site de démonstration n’est pas encore relié à un service d’envoi.'
    bookingForm.reset()
})