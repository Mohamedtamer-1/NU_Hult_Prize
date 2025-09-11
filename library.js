// Library page specific JavaScript

document.addEventListener("DOMContentLoaded", () => {
  try {
    console.time("Library page initialization")

    initializeLibraryAnimations()
    initializeGalleryInteractions()
    initializeResourceCards()

    console.timeEnd("Library page initialization")
    console.log("Library page JavaScript initialized successfully")
  } catch (error) {
    console.error("Error initializing library page:", error)
  }
})

function initializeLibraryAnimations() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  if (prefersReducedMotion) {
    // Skip animations for users who prefer reduced motion
    return
  }

  const seasonCards = document.querySelectorAll(".season-card")
  if (!seasonCards.length) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          const card = entry.target
          const delay = Array.from(seasonCards).indexOf(card) * 200

          setTimeout(() => {
            card.style.transition = "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
            card.style.opacity = "1"
            card.style.transform = "translateY(0)"
          }, delay)

          observer.unobserve(card)
        }
      })
    },
    { threshold: 0.2 },
  )

  // Set initial state and observe
  seasonCards.forEach((card) => {
    card.style.opacity = "0"
    card.style.transform = "translateY(30px)"
    observer.observe(card)
  })
}

function initializeGalleryInteractions() {
  const galleryImages = document.querySelectorAll(".gallery-grid img")

  galleryImages.forEach((img, index) => {
    img.addEventListener("mouseenter", () => {
      img.style.transform = "scale(1.05)"
      img.style.zIndex = "10"
    })

    img.addEventListener("mouseleave", () => {
      img.style.transform = "scale(1)"
      img.style.zIndex = "1"
    })

    img.addEventListener("focus", () => {
      img.style.transform = "scale(1.05)"
      img.style.zIndex = "10"
    })

    img.addEventListener("blur", () => {
      img.style.transform = "scale(1)"
      img.style.zIndex = "1"
    })

    img.addEventListener("click", () => {
      openImageModal(img)
    })

    img.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        openImageModal(img)
      }
    })

    img.setAttribute("tabindex", "0")
    img.style.cursor = "pointer"
  })
}

function initializeResourceCards() {
  const resourceCards = document.querySelectorAll(".resource-card")

  resourceCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-8px)"
      card.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.3)"
    })

    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0)"
      card.style.boxShadow = "none"
    })

    const link = card.querySelector(".resource-link")
    if (link) {
      link.addEventListener("focus", () => {
        card.style.transform = "translateY(-8px)"
        card.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.3)"
      })

      link.addEventListener("blur", () => {
        card.style.transform = "translateY(0)"
        card.style.boxShadow = "none"
      })
    }
  })
}

function openImageModal(img) {
  try {
    // Create modal if it doesn't exist
    let modal = document.getElementById("imageModal")

    if (!modal) {
      modal = createImageModal()
    }

    const modalImg = modal.querySelector(".modal-image")
    const modalCaption = modal.querySelector(".modal-caption")

    if (modalImg && modalCaption) {
      modalImg.src = img.src
      modalImg.alt = img.alt
      modalCaption.textContent = img.alt

      modal.classList.add("active")
      modal.setAttribute("aria-hidden", "false")
      document.body.style.overflow = "hidden"

      // Focus on modal for accessibility
      modal.focus()
    }
  } catch (error) {
    console.warn("Failed to open image modal:", error)
  }
}

function createImageModal() {
  const modal = document.createElement("div")
  modal.id = "imageModal"
  modal.className = "image-modal"
  modal.setAttribute("role", "dialog")
  modal.setAttribute("aria-labelledby", "modal-caption")
  modal.setAttribute("aria-hidden", "true")
  modal.setAttribute("tabindex", "-1")

  modal.innerHTML = `
    <div class="modal-backdrop" aria-hidden="true"></div>
    <div class="modal-content">
      <button class="modal-close" aria-label="Close image modal">&times;</button>
      <img class="modal-image" alt="" loading="lazy">
      <p id="modal-caption" class="modal-caption"></p>
    </div>
  `

  const modalStyles = document.createElement("style")
  modalStyles.textContent = `
    .image-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2000;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    
    .image-modal.active {
      display: flex;
    }
    
    .modal-backdrop {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.9);
      backdrop-filter: blur(5px);
    }
    
    .modal-content {
      position: relative;
      max-width: 90vw;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .modal-image {
      max-width: 100%;
      max-height: 80vh;
      object-fit: contain;
      border-radius: 8px;
    }
    
    .modal-caption {
      color: white;
      text-align: center;
      margin-top: 1rem;
      font-size: 1rem;
    }
    
    .modal-close {
      position: absolute;
      top: -40px;
      right: 0;
      background: none;
      border: none;
      color: white;
      font-size: 2rem;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 4px;
      transition: background-color 0.3s ease;
    }
    
    .modal-close:hover,
    .modal-close:focus {
      background-color: rgba(255, 255, 255, 0.1);
      outline: 2px solid var(--primary-red);
    }
    
    @media (max-width: 768px) {
      .image-modal {
        padding: 1rem;
      }
      
      .modal-close {
        top: -30px;
        font-size: 1.5rem;
      }
    }
  `

  document.head.appendChild(modalStyles)
  document.body.appendChild(modal)

  const closeButton = modal.querySelector(".modal-close")
  const backdrop = modal.querySelector(".modal-backdrop")

  const closeModal = () => {
    modal.classList.remove("active")
    modal.setAttribute("aria-hidden", "true")
    document.body.style.overflow = "auto"
  }

  closeButton.addEventListener("click", closeModal)
  backdrop.addEventListener("click", closeModal)

  modal.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal()
    }
  })

  return modal
}

function initializeSeasonCardInteractions() {
  const seasonCards = document.querySelectorAll(".season-card")

  seasonCards.forEach((card) => {
    const banner = card.querySelector(".season-banner")

    if (banner) {
      card.addEventListener("mouseenter", () => {
        banner.style.transform = "scale(1.05)"
      })

      card.addEventListener("mouseleave", () => {
        banner.style.transform = "scale(1)"
      })
    }
  })
}

function initializeHighlightAnimations() {
  const highlights = document.querySelectorAll(".highlights")

  if (!highlights.length) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const highlight = entry.target
          const listItems = highlight.querySelectorAll("li")

          listItems.forEach((item, index) => {
            setTimeout(() => {
              item.style.opacity = "1"
              item.style.transform = "translateX(0)"
            }, index * 100)
          })

          observer.unobserve(highlight)
        }
      })
    },
    { threshold: 0.5 },
  )

  highlights.forEach((highlight) => {
    const listItems = highlight.querySelectorAll("li")

    listItems.forEach((item) => {
      item.style.opacity = "0"
      item.style.transform = "translateX(-20px)"
      item.style.transition = "all 0.5s ease"
    })

    observer.observe(highlight)
  })
}

function measureLibraryPerformance() {
  // Measure image loading performance
  const images = document.querySelectorAll("img")
  let loadedImages = 0

  const startTime = performance.now()

  images.forEach((img) => {
    if (img.complete) {
      loadedImages++
    } else {
      img.addEventListener("load", () => {
        loadedImages++

        if (loadedImages === images.length) {
          const endTime = performance.now()
          console.log(`All images loaded in ${endTime - startTime} milliseconds`)
        }
      })
    }
  })

  if (loadedImages === images.length) {
    const endTime = performance.now()
    console.log(`All images were already loaded in ${endTime - startTime} milliseconds`)
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Add small delay to ensure DOM is fully ready
  setTimeout(() => {
    initializeSeasonCardInteractions()
    initializeHighlightAnimations()
    measureLibraryPerformance()
  }, 100)
})

window.addEventListener("beforeunload", () => {
  console.log("Cleaning up library page resources")

  // Remove any event listeners or observers if needed
  const modal = document.getElementById("imageModal")
  if (modal) {
    modal.remove()
  }
})
