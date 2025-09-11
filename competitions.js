// Competitions page specific JavaScript

let currentCompetition = ""
let registrationModal = null
const focusTrap = null

// Declare utility functions
function handleError(error, context) {
  console.error(`Error in ${context}:`, error)
}

function trapFocus(element) {
  // Focus trapping logic here
}

function debounce(func, wait) {
  let timeout
  return function (...args) {
    
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

function showLoading(button) {
  // Show loading logic here
  return "loadingState" // Placeholder return value
}

function hideLoading(button, loadingState) {
  // Hide loading logic here
}

function showToast(message, type, duration) {
  // Show toast logic here
}

function validateRequired(value) {
  return value !== null && value !== undefined && value.trim() !== ""
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

function validatePhone(phone) {
  // Phone validation logic here
  return true // Placeholder return value
}

function setLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function getLocalStorage(key) {
  const value = localStorage.getItem(key)
  return value ? JSON.parse(value) : null
}

document.addEventListener("DOMContentLoaded", () => {
  try {
    initializeAccordion()
    initializeRegistrationModal()
    animateCompetitionElements()
    initializeCompetitionStatsCounterAnimation()
    initializeFormValidation()

    console.log("Competitions page JavaScript initialized successfully")
  } catch (error) {
    handleError(error, "Competitions page initialization")
  }
})

function toggleAccordion(header) {
  try {
    const item = header.parentElement
    const content = item.querySelector(".accordion-content")
    const icon = header.querySelector(".accordion-icon")
    const isActive = item.classList.contains("active")

    // Close other open accordions
    document.querySelectorAll(".accordion-item").forEach((otherItem) => {
      if (otherItem !== item && otherItem.classList.contains("active")) {
        closeAccordionItem(otherItem)
      }
    })

    // Toggle current accordion
    if (isActive) {
      closeAccordionItem(item)
    } else {
      openAccordionItem(item)
    }
  } catch (error) {
    handleError(error, "Accordion toggle")
  }
}

function openAccordionItem(item) {
  const content = item.querySelector(".accordion-content")
  const icon = item.querySelector(".accordion-icon")

  item.classList.add("active")
  icon.textContent = "×"
  content.style.maxHeight = content.scrollHeight + "px"

  const header = item.querySelector(".accordion-header")
  header.setAttribute("aria-expanded", "true")
  content.setAttribute("aria-hidden", "false")
}

function closeAccordionItem(item) {
  const content = item.querySelector(".accordion-content")
  const icon = item.querySelector(".accordion-icon")

  item.classList.remove("active")
  icon.textContent = "+"
  content.style.maxHeight = "0"

  const header = item.querySelector(".accordion-header")
  header.setAttribute("aria-expanded", "false")
  content.setAttribute("aria-hidden", "true")
}

function initializeAccordion() {
  document.querySelectorAll(".accordion-item").forEach((item) => {
    const content = item.querySelector(".accordion-content")
    const icon = item.querySelector(".accordion-icon")
    const header = item.querySelector(".accordion-header")

    if (!item.classList.contains("active")) {
      content.style.maxHeight = "0"
      icon.textContent = "+"
      header.setAttribute("aria-expanded", "false")
      content.setAttribute("aria-hidden", "true")
    }

    header.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        toggleAccordion(header)
      }
    })

    header.setAttribute("tabindex", "0")
    header.setAttribute("role", "button")
  })
}

function openRegistrationForm(competitionType) {
  try {
    currentCompetition = competitionType
    registrationModal = document.getElementById("registrationModal")
    const modalTitle = document.getElementById("modalTitle")

    if (!registrationModal || !modalTitle) {
      throw new Error("Modal elements not found")
    }

    // Set modal title based on competition type
    const titles = {
      "climate-action": "Register for Climate Action Challenge",
      oncampus: "Apply for OnCampus Program",
      hackathon: "Register for Social Impact Hackathon",
    }

    modalTitle.textContent = titles[competitionType] || "Register for Competition"

    registrationModal.classList.add("active")
    registrationModal.setAttribute("aria-hidden", "false")
    document.body.style.overflow = "hidden"

    trapFocus(registrationModal)

    // Focus on first input with delay for better UX
    setTimeout(() => {
      const firstInput = registrationModal.querySelector("input:not([disabled])")
      if (firstInput) {
        firstInput.focus()
      }
    }, 300)
  } catch (error) {
    handleError(error, "Opening registration form")
  }
}

function closeRegistrationForm() {
  try {
    if (!registrationModal) return

    registrationModal.classList.remove("active")
    registrationModal.setAttribute("aria-hidden", "true")
    document.body.style.overflow = "auto"

    const form = document.getElementById("registrationForm")
    if (form) {
      form.reset()
      clearFormErrors(form)
    }

    // Clear dynamic team member fields
    const teamMembersSection = document.getElementById("teamMembersSection")
    if (teamMembersSection) {
      teamMembersSection.innerHTML = ""
    }

    const activeElement = document.activeElement
    if (activeElement && activeElement.blur) {
      activeElement.blur()
    }
  } catch (error) {
    handleError(error, "Closing registration form")
  }
}

function initializeRegistrationModal() {
  registrationModal = document.getElementById("registrationModal")
  if (!registrationModal) return

  registrationModal.addEventListener("click", (e) => {
    if (e.target === registrationModal) {
      closeRegistrationForm()
    }
  })

  // Close modal with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && registrationModal.classList.contains("active")) {
      closeRegistrationForm()
    }
  })

  const form = document.getElementById("registrationForm")
  if (form) {
    form.addEventListener("submit", handleFormSubmission)

    form.addEventListener("input", debounce(handleFormInput, 300))
    form.addEventListener("blur", handleFormBlur, true)
  }
}

function updateMemberFields() {
  try {
    const teamSize = document.getElementById("teamSize").value
    const container = document.getElementById("teamMembersSection")

    if (!container) return

    container.innerHTML = ""

    if (teamSize && teamSize > 1) {
      for (let i = 2; i <= teamSize; i++) {
        const memberGroup = document.createElement("div")
        memberGroup.className = "member-group"
        memberGroup.innerHTML = `
          <h5>Team Member ${i}</h5>
          <div class="form-row">
            <div class="form-group">
              <label for="member${i}Name">Full Name *</label>
              <input type="text" id="member${i}Name" name="member${i}Name" required 
                     aria-describedby="member${i}Name-error">
              <div id="member${i}Name-error" class="error-message" aria-live="polite"></div>
            </div>
            <div class="form-group">
              <label for="member${i}Email">Email *</label>
              <input type="email" id="member${i}Email" name="member${i}Email" required 
                     aria-describedby="member${i}Email-error">
              <div id="member${i}Email-error" class="error-message" aria-live="polite"></div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="member${i}University">University</label>
              <input type="text" id="member${i}University" name="member${i}University">
            </div>
            <div class="form-group">
              <label for="member${i}Faculty">Faculty/Department</label>
              <input type="text" id="member${i}Faculty" name="member${i}Faculty">
            </div>
          </div>
        `
        container.appendChild(memberGroup)
      }
    }
  } catch (error) {
    handleError(error, "Updating member fields")
  }
}

function handleFormSubmission(e) {
  e.preventDefault()

  try {
    const form = e.target
    const formData = new FormData(form)
    const submitButton = form.querySelector('button[type="submit"]')

    if (!validateRegistrationForm(formData, form)) {
      return
    }

    // Show loading state
    const loadingState = showLoading(submitButton)

    setTimeout(() => {
      try {
        hideLoading(submitButton, loadingState)

        showToast(
          "Registration submitted successfully! You will receive a confirmation email shortly.",
          "success",
          6000,
        )

        saveFormDataToStorage(formData)

        // Close modal
        closeRegistrationForm()

        console.log("Registration Data:", Object.fromEntries(formData))

        trackEvent("form_submission", {
          competition: currentCompetition,
          team_size: formData.get("teamSize"),
        })
      } catch (error) {
        hideLoading(submitButton, loadingState)
        handleError(error, "Form submission processing")
      }
    }, 2000)
  } catch (error) {
    handleError(error, "Form submission")
  }
}

function validateRegistrationForm(formData, form) {
  let isValid = true
  const errors = {}

  const validationRules = {
    leaderName: { required: true, minLength: 2 },
    leaderEmail: { required: true, email: true },
    leaderPhone: { required: true, phone: true },
    university: { required: true },
    faculty: { required: true },
    teamName: { required: true, minLength: 3 },
    teamSize: { required: true },
  }

  // Validate main fields
  for (const [field, rules] of Object.entries(validationRules)) {
    const value = formData.get(field)
    const error = validateField(value, rules)

    if (error) {
      errors[field] = error
      isValid = false
    }
  }

  const teamSize = Number.parseInt(formData.get("teamSize"))
  if (teamSize > 1) {
    for (let i = 2; i <= teamSize; i++) {
      const memberName = formData.get(`member${i}Name`)
      const memberEmail = formData.get(`member${i}Email`)

      if (!validateRequired(memberName)) {
        errors[`member${i}Name`] = "Team member name is required"
        isValid = false
      }

      if (!validateRequired(memberEmail)) {
        errors[`member${i}Email`] = "Team member email is required"
        isValid = false
      } else if (!validateEmail(memberEmail)) {
        errors[`member${i}Email`] = "Please enter a valid email address"
        isValid = false
      }
    }
  }

  displayFormErrors(errors, form)

  return isValid
}

function validateField(value, rules) {
  if (rules.required && !validateRequired(value)) {
    return "This field is required"
  }

  if (value && rules.minLength && value.length < rules.minLength) {
    return `Must be at least ${rules.minLength} characters`
  }

  if (value && rules.email && !validateEmail(value)) {
    return "Please enter a valid email address"
  }

  if (value && rules.phone && !validatePhone(value)) {
    return "Please enter a valid phone number"
  }

  return null
}

function displayFormErrors(errors, form) {
  // Clear previous errors
  clearFormErrors(form)

  // Display new errors
  for (const [field, message] of Object.entries(errors)) {
    const errorElement = form.querySelector(`#${field}-error`)
    const inputElement = form.querySelector(`#${field}`)

    if (errorElement) {
      errorElement.textContent = message
      errorElement.classList.add("show")
    }

    if (inputElement) {
      inputElement.setAttribute("aria-invalid", "true")
      inputElement.classList.add("error")
    }
  }

  // Focus first error field
  const firstErrorField = Object.keys(errors)[0]
  if (firstErrorField) {
    const firstErrorInput = form.querySelector(`#${firstErrorField}`)
    if (firstErrorInput) {
      firstErrorInput.focus()
    }
  }
}

function clearFormErrors(form) {
  const errorElements = form.querySelectorAll(".error-message")
  const inputElements = form.querySelectorAll("input, select, textarea")

  errorElements.forEach((el) => {
    el.textContent = ""
    el.classList.remove("show")
  })

  inputElements.forEach((el) => {
    el.removeAttribute("aria-invalid")
    el.classList.remove("error")
  })
}

function handleFormInput(e) {
  const field = e.target
  const form = field.closest("form")
  const fieldName = field.name
  const value = field.value

  // Get validation rules for this field
  const rules = getValidationRules(fieldName)
  if (!rules) return

  const error = validateField(value, rules)
  const errorElement = form.querySelector(`#${fieldName}-error`)

  if (errorElement) {
    if (error) {
      errorElement.textContent = error
      errorElement.classList.add("show")
      field.setAttribute("aria-invalid", "true")
      field.classList.add("error")
    } else {
      errorElement.textContent = ""
      errorElement.classList.remove("show")
      field.removeAttribute("aria-invalid")
      field.classList.remove("error")
    }
  }
}

function handleFormBlur(e) {
  // Validate on blur for better UX
  handleFormInput(e)
}

function getValidationRules(fieldName) {
  const rules = {
    leaderName: { required: true, minLength: 2 },
    leaderEmail: { required: true, email: true },
    leaderPhone: { required: true, phone: true },
    university: { required: true },
    faculty: { required: true },
    teamName: { required: true, minLength: 3 },
    teamSize: { required: true },
  }

  // Handle dynamic member fields
  if (fieldName.startsWith("member") && fieldName.includes("Name")) {
    return { required: true, minLength: 2 }
  }

  if (fieldName.startsWith("member") && fieldName.includes("Email")) {
    return { required: true, email: true }
  }

  return rules[fieldName]
}

function saveFormDataToStorage(formData) {
  try {
    const data = Object.fromEntries(formData)
    setLocalStorage(`registration_backup_${currentCompetition}`, {
      data,
      timestamp: Date.now(),
    })
  } catch (error) {
    console.warn("Failed to save form data:", error)
  }
}

function loadFormDataFromStorage() {
  try {
    const backup = getLocalStorage(`registration_backup_${currentCompetition}`)
    if (backup && backup.data) {
      // Auto-fill form if backup is less than 1 hour old
      const oneHour = 60 * 60 * 1000
      if (Date.now() - backup.timestamp < oneHour) {
        return backup.data
      }
    }
  } catch (error) {
    console.warn("Failed to load form data:", error)
  }
  return null
}

function initializeFormValidation() {
  const form = document.getElementById("registrationForm")
  if (!form) return

  // Add CSS classes for validation styling
  const style = document.createElement("style")
  style.textContent = `
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
      border-color: var(--error-red);
      box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
    }
    
    .error-message.show {
      display: block;
      color: var(--error-red);
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
  `
  document.head.appendChild(style)
}

function animateCompetitionElements() {
  try {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (prefersReducedMotion) {
      // Skip animations for users who prefer reduced motion
      return
    }

    // Animate competition highlight
    const highlight = document.querySelector(".competition-highlight")
    if (highlight) {
      highlight.style.opacity = "0"
      highlight.style.transform = "translateY(30px)"

      setTimeout(() => {
        highlight.style.transition = "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
        highlight.style.opacity = "1"
        highlight.style.transform = "translateY(0)"
      }, 300)
    }

    // Stagger accordion items animation
    const accordionItems = document.querySelectorAll(".accordion-item")
    accordionItems.forEach((item, index) => {
      item.style.opacity = "0"
      item.style.transform = "translateY(20px)"

      setTimeout(
        () => {
          item.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
          item.style.opacity = "1"
          item.style.transform = "translateY(0)"
        },
        600 + index * 150,
      )
    })
  } catch (error) {
    console.warn("Animation error:", error)
  }
}

function initializeCompetitionStatsCounterAnimation() {
  const statNumbers = document.querySelectorAll(".stat-number")
  if (!statNumbers.length) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.classList.contains("animated")) {
          entry.target.classList.add("animated")

          try {
            animateCompetitionStat(entry.target)
          } catch (error) {
            console.warn("Failed to animate competition stat:", error)
          }

          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.7 },
  )

  statNumbers.forEach((stat) => {
    observer.observe(stat)
  })
}

function animateCompetitionStat(element) {
  const text = element.textContent.trim()

  if (text.includes("$")) {
    element.style.color = "var(--primary-red)"
    element.style.transform = "scale(1.1)"
    setTimeout(() => {
      element.style.transform = "scale(1)"
    }, 300)
  } else if (text.includes("Mar")) {
    element.style.color = "var(--accent-gold)"
    element.classList.add("pulse-animation")
  } else {
    element.style.color = "var(--text-white)"
  }
}

function trackEvent(eventName, properties = {}) {
  // Placeholder for analytics tracking
  console.log(`Event: ${eventName}`, properties)
}

function searchCompetitions(query) {
  const items = document.querySelectorAll(".accordion-item")
  const searchTerm = query.toLowerCase().trim()

  if (!searchTerm) {
    items.forEach((item) => (item.style.display = "block"))
    return
  }

  items.forEach((item) => {
    const title = item.querySelector("h3").textContent.toLowerCase()
    const content = item.querySelector(".competition-details").textContent.toLowerCase()

    if (title.includes(searchTerm) || content.includes(searchTerm)) {
      item.style.display = "block"
    } else {
      item.style.display = "none"
    }
  })
}

function filterByStatus(status) {
  const items = document.querySelectorAll(".accordion-item")

  items.forEach((item) => {
    const badge = item.querySelector(".status-badge")
    if (status === "all" || badge.classList.contains(status)) {
      item.style.display = "block"
    } else {
      item.style.display = "none"
    }
  })
}

// Add enhanced pulse animation CSS
const pulseStyles = document.createElement("style")
pulseStyles.textContent = `
    .pulse-animation {
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
        100% {
            transform: scale(1);
        }
    }
    
    @media (prefers-reduced-motion: reduce) {
        .pulse-animation {
            animation: none;
        }
    }
`
document.head.appendChild(pulseStyles)
