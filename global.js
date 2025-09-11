// Global JavaScript functionality

document.addEventListener("DOMContentLoaded", () => {
  const cursor = document.querySelector(".cursor")
  const cursorFollower = document.querySelector(".cursor-follower")

  // Check if user prefers reduced motion or is on mobile
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const isMobile = window.innerWidth <= 768 || "ontouchstart" in window

  if (cursor && cursorFollower && !prefersReducedMotion && !isMobile) {
    let mouseX = 0
    let mouseY = 0
    let followerX = 0
    let followerY = 0

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX
      mouseY = e.clientY

      cursor.style.left = mouseX + "px"
      cursor.style.top = mouseY + "px"
    })

    // Smooth follower animation with requestAnimationFrame
    function animateFollower() {
      followerX += (mouseX - followerX) * 0.1
      followerY += (mouseY - followerY) * 0.1

      cursorFollower.style.left = followerX + "px"
      cursorFollower.style.top = followerY + "px"

      requestAnimationFrame(animateFollower)
    }
    animateFollower()

    const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, textarea, select')

    interactiveElements.forEach((element) => {
      element.addEventListener("mouseenter", () => {
        cursor.style.transform = "scale(1.5)"
        cursor.style.borderColor = "var(--primary-red)"
      })

      element.addEventListener("mouseleave", () => {
        cursor.style.transform = "scale(1)"
        cursor.style.borderColor = "var(--primary-red)"
      })
    })
  } else {
    // Hide cursors if not supported
    if (cursor) cursor.style.display = "none"
    if (cursorFollower) cursorFollower.style.display = "none"
  }
})

document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger")
  const navMenu = document.querySelector(".nav-menu")

  if (hamburger && navMenu) {
    let isMenuOpen = false

    hamburger.addEventListener("click", () => {
      isMenuOpen = !isMenuOpen
      hamburger.classList.toggle("active")
      navMenu.classList.toggle("active")

      hamburger.setAttribute("aria-expanded", isMenuOpen)
      navMenu.setAttribute("aria-hidden", !isMenuOpen)

      document.body.style.overflow = isMenuOpen ? "hidden" : "auto"
    })

    // Close menu when clicking on a link
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        closeMenu()
      })
    })

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isMenuOpen) {
        closeMenu()
      }
    })

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (isMenuOpen && !hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        closeMenu()
      }
    })

    function closeMenu() {
      isMenuOpen = false
      hamburger.classList.remove("active")
      navMenu.classList.remove("active")
      hamburger.setAttribute("aria-expanded", false)
      navMenu.setAttribute("aria-hidden", true)
      document.body.style.overflow = "auto"
    }
  }
})

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href")
      const target = document.querySelector(targetId)

      if (target) {
        const navbar = document.querySelector(".navbar")
        const navbarHeight = navbar ? navbar.offsetHeight : 0
        const targetPosition = target.offsetTop - navbarHeight - 20

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })

        target.focus({ preventScroll: true })
      }
    })
  })
})

document.addEventListener("DOMContentLoaded", () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in-up")
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  // Observe elements that should animate
  const animatedElements = document.querySelectorAll(
    ".stat-item, .program-card, .sponsor-card, .blog-card, .season-card, .resource-card",
  )

  animatedElements.forEach((el) => {
    observer.observe(el)
  })
})

document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navbar")

  if (navbar) {
    let ticking = false

    function updateNavbar() {
      const scrollY = window.scrollY

      if (scrollY > 100) {
        navbar.style.backgroundColor = "rgba(26, 26, 26, 0.98)"
        navbar.style.backdropFilter = "blur(15px)"
      } else {
        navbar.style.backgroundColor = "rgba(26, 26, 26, 0.95)"
        navbar.style.backdropFilter = "blur(10px)"
      }

      ticking = false
    }

    function requestTick() {
      if (!ticking) {
        requestAnimationFrame(updateNavbar)
        ticking = true
      }
    }

    window.addEventListener("scroll", requestTick, { passive: true })
  }
})

function animateValue(element, start, end, duration, formatter = null) {
  let startTimestamp = null

  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp
    const progress = Math.min((timestamp - startTimestamp) / duration, 1)

    // Use easing function for smoother animation
    const easeOutQuart = 1 - Math.pow(1 - progress, 4)
    const value = Math.floor(easeOutQuart * (end - start) + start)

    element.textContent = formatter ? formatter(value) : value

    if (progress < 1) {
      window.requestAnimationFrame(step)
    }
  }

  window.requestAnimationFrame(step)
}

document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll(".stat-number")
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const counter = entry.target
          const text = counter.textContent.trim()

          if (!counter.classList.contains("animated")) {
            counter.classList.add("animated")
            animateCounter(counter, text)
            counterObserver.unobserve(counter)
          }
        }
      })
    },
    { threshold: 0.5 },
  )

  counters.forEach((counter) => {
    counterObserver.observe(counter)
  })
})

function animateCounter(element, originalText) {
  const hasPlus = originalText.includes("+")
  const hasK = originalText.toLowerCase().includes("k")
  const hasM = originalText.toLowerCase().includes("m")
  const hasB = originalText.toLowerCase().includes("b")
  const hasDollar = originalText.includes("$")

  // Extract numeric value
  let number = Number.parseFloat(originalText.replace(/[^\d.]/g, ""))

  if (isNaN(number)) {
    return // Skip animation for non-numeric content
  }

  // Convert to actual number
  if (hasK) number *= 1000
  if (hasM) number *= 1000000
  if (hasB) number *= 1000000000

  const formatter = (value) => {
    let displayText = value.toString()

    // Format back to original format
    if (hasK && value >= 1000) {
      displayText = (value / 1000).toFixed(value % 1000 === 0 ? 0 : 1) + "K"
    } else if (hasM && value >= 1000000) {
      displayText = (value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1) + "M"
    } else if (hasB && value >= 1000000000) {
      displayText = (value / 1000000000).toFixed(value % 1000000000 === 0 ? 0 : 1) + "B"
    }

    if (hasDollar) displayText = "$" + displayText
    if (hasPlus) displayText += "+"

    return displayText
  }

  animateValue(element, 0, number, 2000, formatter)
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email.toLowerCase())
}

function validatePhone(phone) {
  // More flexible phone validation
  const cleaned = phone.replace(/\D/g, "")
  return cleaned.length >= 10 && cleaned.length <= 15
}

function validateRequired(value) {
  return value && value.trim().length > 0
}

function showLoading(button) {
  if (!button) return null

  const originalText = button.textContent
  const originalDisabled = button.disabled

  button.textContent = "Loading..."
  button.disabled = true
  button.classList.add("loading")

  return { originalText, originalDisabled }
}

function hideLoading(button, state) {
  if (!button || !state) return

  button.textContent = state.originalText
  button.disabled = state.originalDisabled
  button.classList.remove("loading")
}

function showToast(message, type = "info", duration = 5000) {
  const toast = document.createElement("div")
  toast.className = `toast toast-${type}`
  toast.textContent = message
  toast.setAttribute("role", "alert")
  toast.setAttribute("aria-live", "assertive")

  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 10000;
    max-width: 400px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    animation: slideInRight 0.3s ease;
    word-wrap: break-word;
  `

  const colors = {
    success: "#22c55e",
    error: "#ef4444",
    warning: "#f59e0b",
    info: "#3b82f6",
  }

  toast.style.backgroundColor = colors[type] || colors.info

  const closeButton = document.createElement("button")
  closeButton.innerHTML = "×"
  closeButton.style.cssText = `
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    margin-left: 12px;
    cursor: pointer;
    padding: 0;
    line-height: 1;
  `
  closeButton.setAttribute("aria-label", "Close notification")

  closeButton.addEventListener("click", () => removeToast(toast))
  toast.appendChild(closeButton)

  document.body.appendChild(toast)

  const timeoutId = setTimeout(() => removeToast(toast), duration)

  // Store timeout ID for potential early removal
  toast.timeoutId = timeoutId
}

function removeToast(toast) {
  if (!toast || !toast.parentNode) return

  // Clear timeout if exists
  if (toast.timeoutId) {
    clearTimeout(toast.timeoutId)
  }

  toast.style.animation = "slideOutRight 0.3s ease"
  setTimeout(() => {
    if (toast.parentNode) {
      document.body.removeChild(toast)
    }
  }, 300)
}

function handleError(error, context = "") {
  console.error(`Error in ${context}:`, error)

  // Show user-friendly error message
  showToast("Something went wrong. Please try again or contact support if the problem persists.", "error")
}

function measurePerformance(name, fn) {
  return function (...args) {
    const start = performance.now()
    const result = fn.apply(this, args)
    const end = performance.now()

    console.log(`${name} took ${end - start} milliseconds`)
    return result
  }
}

function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  )

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  element.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus()
          e.preventDefault()
        }
      }
    }
  })

  // Focus first element
  firstElement?.focus()
}

function setLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.warn("Failed to save to localStorage:", error)
    return false
  }
}

function getLocalStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.warn("Failed to read from localStorage:", error)
    return defaultValue
  }
}

function debounce(func, wait, immediate = false) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func(...args)
  }
}

function throttle(func, limit) {
  let inThrottle
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Add enhanced CSS for toast animations
const toastStyles = document.createElement("style")
toastStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .toast {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    
    .toast button {
        flex-shrink: 0;
    }
`
document.head.appendChild(toastStyles)

document.addEventListener("DOMContentLoaded", () => {
  try {
    // Initialize any global features that need DOM
    console.log("Global JavaScript initialized successfully")
  } catch (error) {
    handleError(error, "Global initialization")
  }
})
