/* ============================================================
   AI Readiness Assessment — Script
   ============================================================ */
(function () {
    'use strict';

    // --- State ---
    var currentStep = 1;
    var totalSteps = 10;
    var answers = {};

    // --- DOM ---
    var questions = document.querySelectorAll('.assessment-question');
    var progressFill = document.getElementById('progressFill');
    var progressLabel = document.getElementById('progressLabel');
    var progressPercent = document.getElementById('progressPercent');
    var progressSection = document.getElementById('progressSection');
    var nextBtn = document.getElementById('nextBtn');
    var backBtn = document.getElementById('backBtn');
    var assessmentNav = document.getElementById('assessmentNav');
    var resultsSection = document.getElementById('resultsSection');
    var industrySelect = document.getElementById('q1-industry');
    var otherIndustryGroup = document.getElementById('otherIndustryGroup');

    // --- Industry "Other" toggle ---
    industrySelect.addEventListener('change', function () {
        otherIndustryGroup.style.display = this.value === 'Other' ? 'block' : 'none';
    });

    // --- Checkbox max selection ---
    document.querySelectorAll('.checkbox-group[data-max]').forEach(function (group) {
        var max = parseInt(group.getAttribute('data-max'), 10);
        var checkboxes = group.querySelectorAll('input[type="checkbox"]');

        checkboxes.forEach(function (cb) {
            cb.addEventListener('change', function () {
                var checked = group.querySelectorAll('input[type="checkbox"]:checked').length;
                checkboxes.forEach(function (c) {
                    var card = c.closest('.checkbox-card');
                    if (!c.checked && checked >= max) {
                        card.classList.add('disabled');
                    } else {
                        card.classList.remove('disabled');
                    }
                });
            });
        });
    });

    // --- Show step ---
    function showStep(step) {
        questions.forEach(function (q) {
            q.classList.remove('active');
        });

        var stepAttr = step === 'lead' ? 'lead' : String(step);
        var target = document.querySelector('.assessment-question[data-step="' + stepAttr + '"]');
        if (target) {
            target.classList.add('active');
        }

        // Progress
        if (step === 'lead') {
            progressFill.style.width = '100%';
            progressLabel.textContent = 'Almost there!';
            progressPercent.textContent = '100%';
            nextBtn.innerHTML = 'Get My Free Report';
            nextBtn.classList.add('submit-btn');
        } else {
            var pct = Math.round((step / totalSteps) * 100);
            progressFill.style.width = pct + '%';
            progressLabel.textContent = 'Question ' + step + ' of ' + totalSteps;
            progressPercent.textContent = pct + '%';
            nextBtn.innerHTML = 'Next <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';
            nextBtn.classList.remove('submit-btn');
        }

        // Back button
        backBtn.style.display = (step === 1) ? 'none' : 'inline-flex';
    }

    // --- Validation ---
    function validateStep(step) {
        if (step === 1) {
            var val = industrySelect.value;
            if (!val) {
                industrySelect.classList.add('form-error', 'shake');
                setTimeout(function () { industrySelect.classList.remove('shake'); }, 400);
                return false;
            }
            industrySelect.classList.remove('form-error');
            if (val === 'Other') {
                var otherVal = document.getElementById('q1-other').value.trim();
                if (!otherVal) {
                    document.getElementById('q1-other').classList.add('form-error', 'shake');
                    setTimeout(function () { document.getElementById('q1-other').classList.remove('shake'); }, 400);
                    return false;
                }
                answers.industry = otherVal;
            } else {
                answers.industry = val;
            }
            return true;
        }

        if (step >= 2 && step <= 5) {
            var nameMap = { 2: 'employees', 3: 'tech', 4: 'manual_time', 5: 'ai_use' };
            var name = nameMap[step];
            var selected = document.querySelector('input[name="' + name + '"]:checked');
            if (!selected) {
                var group = document.querySelector('.assessment-question[data-step="' + step + '"] .radio-group');
                group.classList.add('shake');
                setTimeout(function () { group.classList.remove('shake'); }, 400);
                return false;
            }
            answers[name] = selected.value;
            return true;
        }

        if (step === 6) {
            var checked = document.querySelectorAll('input[name="challenges"]:checked');
            if (checked.length === 0) {
                var grp = document.querySelector('.assessment-question[data-step="6"] .checkbox-group');
                grp.classList.add('shake');
                setTimeout(function () { grp.classList.remove('shake'); }, 400);
                return false;
            }
            answers.challenges = Array.from(checked).map(function (c) { return c.value; });
            return true;
        }

        if (step === 7) {
            var sel7 = document.querySelector('input[name="customer_handling"]:checked');
            if (!sel7) {
                var g7 = document.querySelector('.assessment-question[data-step="7"] .radio-group');
                g7.classList.add('shake');
                setTimeout(function () { g7.classList.remove('shake'); }, 400);
                return false;
            }
            answers.customer_handling = sel7.value;
            return true;
        }

        if (step === 8) {
            var sel8 = document.querySelector('input[name="revenue"]:checked');
            if (!sel8) {
                var g8 = document.querySelector('.assessment-question[data-step="8"] .radio-group');
                g8.classList.add('shake');
                setTimeout(function () { g8.classList.remove('shake'); }, 400);
                return false;
            }
            answers.revenue = sel8.value;
            return true;
        }

        if (step === 9) {
            var sel9 = document.querySelector('input[name="openness"]:checked');
            if (!sel9) {
                var g9 = document.querySelector('.assessment-question[data-step="9"] .radio-group');
                g9.classList.add('shake');
                setTimeout(function () { g9.classList.remove('shake'); }, 400);
                return false;
            }
            answers.openness = sel9.value;
            return true;
        }

        if (step === 10) {
            var checked10 = document.querySelectorAll('input[name="goals"]:checked');
            if (checked10.length === 0) {
                var g10 = document.querySelector('.assessment-question[data-step="10"] .checkbox-group');
                g10.classList.add('shake');
                setTimeout(function () { g10.classList.remove('shake'); }, 400);
                return false;
            }
            answers.goals = Array.from(checked10).map(function (c) { return c.value; });
            return true;
        }

        if (step === 'lead') {
            var nameVal = document.getElementById('lead-name').value.trim();
            var emailVal = document.getElementById('lead-email').value.trim();
            var companyVal = document.getElementById('lead-company').value.trim();
            var valid = true;

            [
                { id: 'lead-name', val: nameVal },
                { id: 'lead-email', val: emailVal },
                { id: 'lead-company', val: companyVal }
            ].forEach(function (f) {
                var el = document.getElementById(f.id);
                if (!f.val) {
                    el.classList.add('form-error', 'shake');
                    setTimeout(function () { el.classList.remove('shake'); }, 400);
                    valid = false;
                } else {
                    el.classList.remove('form-error');
                }
            });

            if (emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
                document.getElementById('lead-email').classList.add('form-error', 'shake');
                setTimeout(function () { document.getElementById('lead-email').classList.remove('shake'); }, 400);
                valid = false;
            }

            if (valid) {
                answers.lead = {
                    name: nameVal,
                    email: emailVal,
                    company: companyVal,
                    phone: document.getElementById('lead-phone').value.trim()
                };
            }

            return valid;
        }

        return true;
    }

    // --- Calculate Score ---
    function calculateScore() {
        var score = 0;

        // Q3: Tech setup (0-25 points, inverted — more manual = more opportunity = higher score)
        var techScores = { paper: 25, basic: 18, industry: 10, integrated: 3 };
        score += techScores[answers.tech] || 10;

        // Q4: Manual time (0-25 points)
        var manualScores = { '<5': 5, '5-15': 12, '15-30': 20, '30+': 25 };
        score += manualScores[answers.manual_time] || 10;

        // Q5: AI use (0-20 points, inverted)
        var aiScores = { none: 20, explored: 14, basic: 8, integrated: 2 };
        score += aiScores[answers.ai_use] || 10;

        // Q7: Customer handling (0-15 points)
        var custScores = { struggling: 15, manual: 12, basic_crm: 7, automated: 2 };
        score += custScores[answers.customer_handling] || 7;

        // Q9: Openness (0-15 points)
        var openScores = { eager: 15, open: 11, hesitant: 6, resistant: 2 };
        score += openScores[answers.openness] || 7;

        return Math.min(Math.max(score, 0), 100);
    }

    // --- Generate Recommendations ---
    function generateRecommendations() {
        var recs = [];

        // Based on tech level
        if (answers.tech === 'paper' || answers.tech === 'basic') {
            recs.push({
                icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>',
                title: 'Digitize Core Operations',
                desc: 'Moving from manual processes to a connected digital foundation is your biggest opportunity. Start with a modern ERP or operations platform tailored to your industry — the ROI is typically 3-5x within the first year.'
            });
        }

        // Based on manual time
        if (answers.manual_time === '30+' || answers.manual_time === '15-30') {
            recs.push({
                icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
                title: 'Automate Repetitive Tasks',
                desc: 'Your team is spending significant time on repetitive work that AI and automation can handle. We typically help businesses reclaim 15-25 hours per week through intelligent workflow automation, freeing your team to focus on high-value activities.'
            });
        }

        // Based on customer handling
        if (answers.customer_handling === 'manual' || answers.customer_handling === 'struggling') {
            recs.push({
                icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
                title: 'Upgrade Customer Engagement',
                desc: 'Implementing an AI-powered CRM with automated follow-ups can transform your customer relationships. Businesses that automate customer communication see up to 40% improvement in response times and a 25% increase in customer retention.'
            });
        }

        // Based on challenges
        if (answers.challenges) {
            if (answers.challenges.indexOf('Data entry & reporting') !== -1) {
                recs.push({
                    icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>',
                    title: 'AI-Powered Reporting & Analytics',
                    desc: 'Replace manual data entry with intelligent document processing and automated reporting. AI can extract, organize, and analyze your data in real time — giving you actionable insights instead of spreadsheet headaches.'
                });
            }
            if (answers.challenges.indexOf('Inventory management') !== -1) {
                recs.push({
                    icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
                    title: 'Smart Inventory Management',
                    desc: 'AI-driven inventory systems can predict demand, optimize stock levels, and reduce waste by up to 30%. Stop guessing and start using data to make smarter purchasing and stocking decisions.'
                });
            }
            if (answers.challenges.indexOf('Supply chain coordination') !== -1) {
                recs.push({
                    icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
                    title: 'Supply Chain Visibility',
                    desc: 'Gain end-to-end visibility into your supply chain with real-time tracking, automated alerts, and predictive analytics. Reduce delays, improve supplier coordination, and make data-driven logistics decisions.'
                });
            }
            if (answers.challenges.indexOf('Marketing & lead generation') !== -1) {
                recs.push({
                    icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
                    title: 'AI-Driven Marketing',
                    desc: 'Leverage AI to identify your ideal customers, personalize outreach at scale, and optimize your marketing spend. Businesses using AI-powered marketing see an average 35% improvement in lead quality and conversion rates.'
                });
            }
            if (answers.challenges.indexOf('Quality control') !== -1) {
                recs.push({
                    icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
                    title: 'Automated Quality Assurance',
                    desc: 'Implement AI-powered quality monitoring to catch defects early, maintain consistency, and reduce rework costs. Our quality systems typically help businesses reduce defect rates by 40-60%.'
                });
            }
        }

        // Based on openness
        if (answers.openness === 'resistant' || answers.openness === 'hesitant') {
            recs.push({
                icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
                title: 'Change Management & Training',
                desc: 'Technology only works when your team embraces it. We recommend starting with a structured change management program that includes hands-on training, quick wins to build confidence, and clear communication about how new tools benefit everyone.'
            });
        }

        // General fallback recommendations
        if (recs.length < 3) {
            if (answers.ai_use === 'none' || answers.ai_use === 'explored') {
                recs.push({
                    icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
                    title: 'Start With a Quick AI Pilot',
                    desc: 'You don\'t need to transform everything at once. We recommend identifying one high-impact process and running a 30-day AI pilot. This gives you measurable results fast and builds momentum for broader transformation.'
                });
            }

            recs.push({
                icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/><line x1="14" y1="4" x2="10" y2="20"/></svg>',
                title: 'Custom Software Integration',
                desc: 'Off-the-shelf tools can only take you so far. A custom solution built around your exact workflows can eliminate data silos, reduce errors, and give you capabilities your competitors simply don\'t have.'
            });
        }

        // Limit to 4
        return recs.slice(0, 4);
    }

    // --- Show Results ---
    function showResults() {
        var score = calculateScore();
        var recs = generateRecommendations();

        // Hide quiz UI
        document.getElementById('questionsWrapper').style.display = 'none';
        assessmentNav.style.display = 'none';
        progressSection.style.display = 'none';
        resultsSection.style.display = 'block';

        // Animate gauge
        var gaugeArc = document.getElementById('gaugeArc');
        var scoreDisplay = document.getElementById('scoreDisplay');
        var totalLength = 251.2;
        var targetOffset = totalLength - (score / 100) * totalLength;

        setTimeout(function () {
            gaugeArc.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
            gaugeArc.style.strokeDashoffset = targetOffset;
        }, 200);

        // Animate number
        var startTime = performance.now();
        var duration = 1500;
        function updateScore(currentTime) {
            var elapsed = currentTime - startTime;
            var progress = Math.min(elapsed / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            scoreDisplay.textContent = Math.floor(eased * score);
            if (progress < 1) {
                requestAnimationFrame(updateScore);
            } else {
                scoreDisplay.textContent = score;
            }
        }
        requestAnimationFrame(updateScore);

        // Category
        var categoryName = document.getElementById('categoryName');
        var categoryDesc = document.getElementById('categoryDesc');

        if (score <= 25) {
            categoryName.textContent = 'Early Stage';
            categoryDesc.textContent = 'Your business has significant untapped potential for AI and automation. Small changes could yield major results.';
        } else if (score <= 50) {
            categoryName.textContent = 'Building Foundation';
            categoryDesc.textContent = "You've got the basics in place. Strategic AI implementation could dramatically accelerate your growth.";
        } else if (score <= 75) {
            categoryName.textContent = 'Ready to Scale';
            categoryDesc.textContent = 'Your business is well-positioned for AI transformation. The right solutions could give you a serious competitive edge.';
        } else {
            categoryName.textContent = 'Innovation Leader';
            categoryDesc.textContent = "You're ahead of most. Fine-tuning your AI strategy could optimize what you've already built.";
        }

        // Recommendations
        var recsList = document.getElementById('recommendationsList');
        recsList.innerHTML = '';
        recs.forEach(function (rec) {
            var card = document.createElement('div');
            card.className = 'recommendation-card';
            card.innerHTML =
                '<div class="recommendation-card__icon">' + rec.icon + '</div>' +
                '<h4 class="recommendation-card__title">' + rec.title + '</h4>' +
                '<p class="recommendation-card__desc">' + rec.desc + '</p>';
            recsList.appendChild(card);
        });

        // Build lead data for CRM
        var leadData = {
            name: answers.lead ? answers.lead.name : '',
            email: answers.lead ? answers.lead.email : '',
            company: answers.lead ? answers.lead.company : '',
            phone: answers.lead ? answers.lead.phone : '',
            industry: answers[1] || '',
            employees: answers[2] || '',
            techLevel: answers[3] || '',
            manualHours: answers[4] || '',
            aiAdoption: answers[5] || '',
            challenges: answers[6] || [],
            customerHandling: answers[7] || '',
            revenue: answers[8] || '',
            techOpenness: answers[9] || '',
            goals: answers[10] || [],
            score: score,
            category: score <= 25 ? 'Early Stage' : score <= 50 ? 'Building Foundation' : score <= 75 ? 'Ready to Scale' : 'Innovation Leader',
            timestamp: new Date().toISOString()
        };

        // Save to localStorage as backup
        try {
            localStorage.setItem('jhh_assessment', JSON.stringify(leadData));
        } catch (e) {
            // localStorage not available
        }

        // Send to Google Apps Script CRM
        // REPLACE THIS URL after deploying the Google Apps Script
        var GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzuVWwBEJZGnXdV4E0Ypf9OI5L19cEZaD7ZnEeHYPHYyBSoAZOMJkpTZvmN6pSIYogt/exec';
        
        if (GOOGLE_SCRIPT_URL !== 'PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
            try {
                var params = new URLSearchParams();
                Object.keys(leadData).forEach(function(key) {
                    var val = leadData[key];
                    if (Array.isArray(val)) val = val.join(', ');
                    params.append(key, val);
                });
                var img = new Image();
                img.src = GOOGLE_SCRIPT_URL + '?' + params.toString();
            } catch (e) {
                console.log('CRM submission failed:', e);
            }
        }

        // Scroll to top of results
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // --- Next Button ---
    nextBtn.addEventListener('click', function () {
        if (currentStep === 'lead') {
            if (validateStep('lead')) {
                showResults();
            }
            return;
        }

        if (!validateStep(currentStep)) return;

        if (currentStep === totalSteps) {
            currentStep = 'lead';
            showStep('lead');
        } else {
            currentStep++;
            showStep(currentStep);
        }

        // Scroll to top of assessment
        document.querySelector('.assessment-container').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // --- Back Button ---
    backBtn.addEventListener('click', function () {
        if (currentStep === 'lead') {
            currentStep = totalSteps;
            showStep(currentStep);
        } else if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
        }
    });

    // --- Download placeholder ---
    document.getElementById('downloadBtn').addEventListener('click', function () {
        alert('Your full report will be sent to ' + (answers.lead ? answers.lead.email : 'your email') + ' shortly. Our team is preparing your personalized analysis.');
    });

    // --- Mobile menu ---
    var hamburger = document.getElementById('hamburger');
    var mobileMenu = document.getElementById('mobileMenu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        document.querySelectorAll('.mobile-menu__link').forEach(function (link) {
            link.addEventListener('click', function () {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // --- Init ---
    showStep(1);
})();
