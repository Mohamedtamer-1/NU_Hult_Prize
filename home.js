// Home page specific JavaScript

document.addEventListener("DOMContentLoaded", () => {
  try {
    initializeHeroAnimations()

    initializeParallaxEffects()

    initializeAccentAnimations()

    initializeStatisticsAnimations()

    initializeCardInteractions()

    initializeBlogAnimations()

    console.log("Home page JavaScript initialized successfully")
  } catch (error) {
    console.error(error, "Home page initialization")
  }
})

function initializeHeroAnimations() {
  const heroTitle = document.querySelector(".hero-title")
  const heroDescription = document.querySelector(".hero-description")

  if (!heroTitle || !heroDescription) return

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  if (prefersReducedMotion) {
    // Skip animations for users who prefer reduced motion
    heroTitle.style.opacity = "1"
    heroDescription.style.opacity = "1"
    return
  }

  // Add initial hidden state
  heroTitle.style.opacity = "0"
  heroTitle.style.transform = "translateY(50px)"
  heroDescription.style.opacity = "0"
  heroDescription.style.transform = "translateY(30px)"

  // Animate in sequence with better timing
  const animateElement = (element, delay) => {
    setTimeout(() => {
      element.style.transition = "all 1s cubic-bezier(0.4, 0, 0.2, 1)"
      element.style.opacity = "1"
      element.style.transform = "translateY(0)"
    }, delay)
  }

  animateElement(heroTitle, 300)
  animateElement(heroDescription, 600)
}

function initializeParallaxEffects() {
  const heroBackground = document.querySelector(".hero-background img")
  if (!heroBackground) return

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  if (prefersReducedMotion) return

  let ticking = false

  const updateParallax = () => {
    const scrolled = window.pageYOffset
    const rate = scrolled * -0.3 // Reduced intensity for better performance
    heroBackground.style.transform = `translateY(${rate}px)`
    ticking = false
  }

  const requestTick = () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax)
      ticking = true
    }
  }

  window.addEventListener("scroll", requestTick, { passive: true })
}

function initializeAccentAnimations() {
  const redAccentShape = document.querySelector(".red-accent-shape")
  if (!redAccentShape) return

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  if (prefersReducedMotion) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          redAccentShape.style.animation = "floatAnimation 6s ease-in-out infinite"
          observer.unobserve(entry.target) // Optimize performance
        }
      })
    },
    { threshold: 0.3 },
  )

  observer.observe(redAccentShape)
}

function initializeStatisticsAnimations() {
  const statNumbers = document.querySelectorAll(".stat-number")
  if (!statNumbers.length) return

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.classList.contains("counted")) {
          entry.target.classList.add("counted")

          try {
            animateStatNumber(entry.target)
          } catch (error) {
            console.warn("Failed to animate stat number:", error)
          }

          statsObserver.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.7 },
  )

  statNumbers.forEach((stat) => {
    statsObserver.observe(stat)
  })
}

function animateStatNumber(element) {
  const text = element.textContent.trim()
  const hasPlus = text.includes("+")
  const hasK = text.toLowerCase().includes("k")
  const hasM = text.toLowerCase().includes("m")
  const hasDollar = text.includes("$")

  // Extract the numeric part more reliably
  let number = Number.parseFloat(text.replace(/[^\d.]/g, ""))

  if (isNaN(number)) return

  // Convert to actual number
  if (hasK) number *= 1000
  if (hasM) number *= 1000000

  let current = 0
  const duration = 2000
  const steps = 60
  const increment = number / steps
  const stepTime = duration / steps

  const timer = setInterval(() => {
    current += increment

    if (current >= number) {
      current = number
      clearInterval(timer)
    }

    const displayValue = Math.floor(current)
    let displayText = displayValue.toString()

    // Format the number back to original format
    if (hasK && displayValue >= 1000) {
      displayText = (displayValue / 1000).toFixed(displayValue % 1000 === 0 ? 0 : 1) + "K"
    } else if (hasM && displayValue >= 1000000) {
      displayText = (displayValue / 1000000).toFixed(displayValue % 1000000 === 0 ? 0 : 1) + "M"
    }

    if (hasDollar) displayText = "$" + displayText
    if (hasPlus) displayText += "+"

    element.textContent = displayText
  }, stepTime)
}

function initializeCardInteractions() {
  // Program cards hover effect
  const programCards = document.querySelectorAll(".program-card")
  programCards.forEach((card) => {
    let isHovered = false

    const handleMouseEnter = () => {
      if (!isHovered) {
        isHovered = true
        card.style.transform = "translateY(-10px) scale(1.02)"
      }
    }

    const handleMouseLeave = () => {
      if (isHovered) {
        isHovered = false
        card.style.transform = "translateY(0) scale(1)"
      }
    }

    card.addEventListener("mouseenter", handleMouseEnter)
    card.addEventListener("mouseleave", handleMouseLeave)

    card.addEventListener("focus", handleMouseEnter)
    card.addEventListener("blur", handleMouseLeave)
  })

  const sponsorCards = document.querySelectorAll(".sponsor-card")
  sponsorCards.forEach((card) => {
    const img = card.querySelector("img")
    if (!img) return

    const handleInteraction = (scale) => {
      img.style.transform = `scale(${scale})`
    }

    card.addEventListener("mouseenter", () => handleInteraction(1.1))
    card.addEventListener("mouseleave", () => handleInteraction(1))
    card.addEventListener("focus", () => handleInteraction(1.1))
    card.addEventListener("blur", () => handleInteraction(1))
  })

  const competitionCard = document.querySelector(".competition-card")
  if (competitionCard) {
    let isInteracting = false

    const handleInteractionStart = () => {
      if (!isInteracting) {
        isInteracting = true
        competitionCard.style.transform = "scale(1.02)"
        competitionCard.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.3)"
      }
    }

    const handleInteractionEnd = () => {
      if (isInteracting) {
        isInteracting = false
        competitionCard.style.transform = "scale(1)"
        competitionCard.style.boxShadow = "none"
      }
    }

    competitionCard.addEventListener("mouseenter", handleInteractionStart)
    competitionCard.addEventListener("mouseleave", handleInteractionEnd)
    competitionCard.addEventListener("focus", handleInteractionStart)
    competitionCard.addEventListener("blur", handleInteractionEnd)
  }
}

function initializeBlogAnimations() {
  const blogCards = document.querySelectorAll(".blog-card")
  if (!blogCards.length) return

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  if (prefersReducedMotion) {
    // Skip stagger animation for users who prefer reduced motion
    blogCards.forEach((card) => {
      card.style.opacity = "1"
      card.style.transform = "translateY(0)"
    })
    return
  }

  const blogObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          const card = entry.target
          const delay = Array.from(blogCards).indexOf(card) * 150

          setTimeout(() => {
            card.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
            card.style.opacity = "1"
            card.style.transform = "translateY(0)"
          }, delay)

          blogObserver.unobserve(card)
        }
      })
    },
    { threshold: 0.2 },
  )

  // Set initial state and observe
  blogCards.forEach((card) => {
    card.style.opacity = "0"
    card.style.transform = "translateY(30px)"
    blogObserver.observe(card)
  })
}

const floatingStyles = document.createElement("style")
floatingStyles.textContent = `
    @keyframes floatAnimation {
        0%, 100% {
            transform: translateY(-50%) rotate(0deg);
        }
        25% {
            transform: translateY(-60%) rotate(2deg);
        }
        50% {
            transform: translateY(-40%) rotate(-1deg);
        }
        75% {
            transform: translateY(-55%) rotate(1deg);
        }
    }
    
    @media (prefers-reduced-motion: reduce) {
        @keyframes floatAnimation {
            0%, 100% {
                transform: translateY(-50%) rotate(0deg);
            }
        }
    }
`
document.head.appendChild(floatingStyles)

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId)
  if (!section) return

  const navbar = document.querySelector(".navbar")
  const navbarHeight = navbar ? navbar.offsetHeight : 0
  const additionalOffset = 20
  const targetPosition = section.offsetTop - navbarHeight - additionalOffset

  window.scrollTo({
    top: Math.max(0, targetPosition),
    behavior: "smooth",
  })

  setTimeout(() => {
    section.focus({ preventScroll: true })
  }, 500)
}

function typeWriter(element, text, speed = 100, callback = null) {
  if (!element || !text) return

  let i = 0
  element.textContent = ""

  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i)
      i++
      setTimeout(type, speed)
    } else if (callback) {
      callback()
    }
  }

  type()
}

function createPerformanceObserver() {
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log(`Element ${entry.target.className} is now visible`)
        }
      })
    })

    return observer
  }
  return null
}

function safeAnimate(animationFunction, context = "") {
  try {
    animationFunction()
  } catch (error) {
    console.warn(`Animation error in ${context}:`, error)
  }
}

function cleanup() {
  // Remove event listeners and observers when page is unloaded
  window.addEventListener("beforeunload", () => {
    // Cleanup code here
    console.log("Cleaning up home page resources")
  })
}

// Initialize cleanup
cleanup()
