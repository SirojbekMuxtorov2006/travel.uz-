/* ===== Initialize AOS ===== */
AOS.init({ duration: 800, once: true, offset: 80 });

document.addEventListener('DOMContentLoaded', () => {
	/* ---- Preloader ---- */
	window.addEventListener('load', () => {
		document.getElementById('preloader').classList.add('hidden');
	});

	/* ---- Copyright year ---- */
	document.getElementById('year').textContent = new Date().getFullYear();

	/* ---- Theme toggle (dark/light) with persistence ---- */
	const html = document.documentElement;
	const themeToggle = document.getElementById('themeToggle');
	const themeIcon = themeToggle.querySelector('i');

	const saved = localStorage.getItem('theme');
	const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
	setTheme(saved || (prefersDark ? 'dark' : 'light'));

	themeToggle.addEventListener('click', () => {
		const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
		setTheme(next);
		localStorage.setItem('theme', next);
	});

	function setTheme(theme) {
		html.setAttribute('data-theme', theme);
		themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
	}

	/* ---- Sticky navbar state + back to top + scroll progress ---- */
	const navbar = document.getElementById('mainNav');
	const backToTop = document.getElementById('backToTop');
	const scrollProgress = document.getElementById('scroll-progress');
	const supportsScrollTimeline = CSS.supports('(animation-timeline: scroll()) and (animation-range: 0% 100%)');

	window.addEventListener('scroll', () => {
		navbar.classList.toggle('scrolled', window.scrollY > 40);
		backToTop.classList.toggle('show', window.scrollY > 400);

		// JS Fallback for scroll progress indicator
		if (!supportsScrollTimeline && scrollProgress) {
			const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
			const progress = totalHeight > 0 ? (window.scrollY / totalHeight) : 0;
			scrollProgress.style.transform = `scaleX(${progress})`;
		}
	});
	backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

	/* ---- Gallery lightbox ---- */
	const lightbox = document.getElementById('lightbox');
	const lightboxImg = lightbox.querySelector('.lightbox-img');
	document.querySelectorAll('.gallery-item img').forEach(img => {
		img.addEventListener('click', () => {
			lightboxImg.src = img.src;
			lightbox.classList.add('show');
		});
	});
	const closeLightbox = () => lightbox.classList.remove('show');
	lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
	lightbox.addEventListener('click', e => {
		if (e.target === lightbox) closeLightbox();
	});
	document.addEventListener('keydown', e => {
		if (e.key === 'Escape') closeLightbox();
	});

	/* ---- Countdown timer (resets to 3 days from now) ---- */
	const target = new Date().getTime() + 3 * 24 * 60 * 60 * 1000;
	const cd = {
		days: document.getElementById('cd-days'),
		hours: document.getElementById('cd-hours'),
		mins: document.getElementById('cd-mins'),
		secs: document.getElementById('cd-secs'),
	};
	const pad = n => String(n).padStart(2, '0');

	const timer = setInterval(() => {
		const diff = target - Date.now();
		if (diff <= 0) {
			clearInterval(timer);
			return;
		}
		cd.days.textContent = pad(Math.floor(diff / 86400000));
		cd.hours.textContent = pad(Math.floor((diff % 86400000) / 3600000));
		cd.mins.textContent = pad(Math.floor((diff % 3600000) / 60000));
		cd.secs.textContent = pad(Math.floor((diff % 60000) / 1000));
	}, 1000);

	/* ---- Contact form validation ---- */
	const form = document.getElementById('contactForm');
	const successMsg = document.getElementById('formSuccess');
	form.addEventListener('submit', e => {
		e.preventDefault();
		if (form.checkValidity()) {
			form.classList.remove('was-validated');
			form.reset();
			successMsg.classList.remove('d-none');
			setTimeout(() => successMsg.classList.add('d-none'), 4000);
		} else {
			form.classList.add('was-validated');
		}
	});

	/* ---- Newsletter ---- */
	const nForm = document.getElementById('newsletterForm');
	const nMsg = document.getElementById('newsletterMsg');
	nForm.addEventListener('submit', () => {
		nForm.reset();
		nMsg.classList.remove('d-none');
		setTimeout(() => nMsg.classList.add('d-none'), 3000);
	});
});
