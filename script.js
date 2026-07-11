// Handle Tab Switching
function switchTab(tabId) {
    // 1. Update Buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('btn-' + tabId).classList.add('active');

    // 2. Update Content Areas
    document.querySelectorAll('.app-container').forEach(container => {
        container.style.display = 'none';
        container.classList.remove('active');
    });
    
    const activeContainer = document.getElementById('content-' + tabId);
    activeContainer.style.display = 'flex';
    // Allow small delay for flex display to apply before adding opacity transition if needed
    setTimeout(() => activeContainer.classList.add('active'), 10);

    // 3. Reset Sidebar active link to first item of the new tab
    const firstLink = document.querySelector(`.nav-${tabId}`);
    if (firstLink) {
        document.querySelectorAll(`.nav-${tabId}`).forEach(link => link.classList.remove('active'));
        firstLink.classList.add('active');
        window.scrollTo(0, 0);
    }
}

// Handle active link state on scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        // Only consider sections that are currently visible
        if (section.closest('.app-container').style.display !== 'none') {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= (sectionTop - 250)) {
                current = section.getAttribute('id');
            }
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current) && link.closest('.app-container').style.display !== 'none') {
            link.classList.add('active');
        }
    });
});

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if(targetElement) {
            // Offset for the fixed top tabs
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - 90;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Handle real-time sync for inputs
document.querySelectorAll('.sync-input').forEach(input => {
    input.addEventListener('input', function() {
        const targetClass = this.getAttribute('data-target');
        const value = this.value || this.getAttribute('placeholder').replace('เช่น ', '');
        
        document.querySelectorAll(targetClass).forEach(el => {
            el.textContent = value;
        });
    });
});

// Copy prompt to clipboard
function copyPrompt(elementId) {
    const codeElement = document.getElementById(elementId);
    if (!codeElement) return;

    // Get text content, replacing inner tags with just their text
    let textToCopy = codeElement.innerText || codeElement.textContent;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        // Show success popup with SweetAlert2
        Swal.fire({
            icon: 'success',
            title: 'คัดลอกสำเร็จ!',
            text: 'นำคำสั่งไปวางใน AI ได้เลยครับ',
            timer: 2000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end',
            background: 'rgba(15, 23, 42, 0.9)',
            color: '#fff',
            iconColor: '#ec4899',
            customClass: {
                popup: 'colored-toast'
            }
        });
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        Swal.fire({
            icon: 'error',
            title: 'ผิดพลาด',
            text: 'ไม่สามารถคัดลอกข้อความได้ กรุณาลองใหม่อีกครั้ง'
        });
    });
}
