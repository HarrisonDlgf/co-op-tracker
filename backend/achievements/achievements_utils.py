ACHIEVEMENTS = [
        {
            'name': 'First Steps',
            'description': 'Apply to your first co-op of the cycle',
            'icon': '🎯',
            'condition': lambda u: len(u.applications) >= 1,
            'xp_reward': 25
        },
        {
            'name': 'Getting There',
            'description': 'Apply to 10 co-ops',
            'icon': '💪',
            'condition': lambda u: len(u.applications) >= 10,
            'xp_reward': 50
        },
        {
            'name': 'Application Master',
            'description': 'Apply to 25 co-ops',
            'icon': '📚',
            'condition': lambda u: len(u.applications) >= 25,
            'xp_reward': 100
        },
        {
            'name': 'Co-Op Grinder',
            'description': 'Apply to 50 co-ops',
            'icon': '🏃‍♂️',
            'condition': lambda u: len(u.applications) >= 50,
            'xp_reward': 200
        },
        {
            'name': 'Interview Prep Starts Now',
            'description': 'Get your first interview',
            'icon': '🎤',
            'condition': lambda u: len([app for app in u.applications if app.status == 'Interviewing']) >= 1,
            'xp_reward': 75
        },
        {
            'name': 'Interview Pro',
            'description': 'Get 5 interviews',
            'icon': '🎭',
            'condition': lambda u: len([app for app in u.applications if app.status == 'Interviewing']) >= 5,
            'xp_reward': 150
        },
        {
            'name': 'WE DID IT!',
            'description': 'Receive your first offer',
            'icon': '🏆',
            'condition': lambda u: len([app for app in u.applications if app.status == 'Offer']) >= 1,
            'xp_reward': 300
        },
        {
            'name': 'Offer Collector',
            'description': 'Receive 3 offers',
            'icon': '💎',
            'condition': lambda u: len([app for app in u.applications if app.status == 'Offer']) >= 3,
            'xp_reward': 500
        },
        {
            'name': 'Getting Good At This',
            'description': 'Reach level 2',
            'icon': '⭐',
            'condition': lambda u: u.level >= 2,
            'xp_reward': 50
        },
        {
            'name': 'Level Up!',
            'description': 'Reach level 5',
            'icon': '🌟',
            'condition': lambda u: u.level >= 5,
            'xp_reward': 100
        },
        {
            'name': '10 Levels of Co-Op Grind, Wow',
            'description': 'Reach level 10',
            'icon': '🔟',
            'condition': lambda u: u.level >= 10,
            'xp_reward': 250
        },
        {
            'name': 'XP Hunter',
            'description': 'Earn 500 total XP',
            'icon': '🔥',
            'condition': lambda u: u.xp >= 500,
            'xp_reward': 100
        },
        {
            'name': 'XP Master',
            'description': 'Earn 1000 total XP',
            'icon': '⚡',
            'condition': lambda u: u.xp >= 1000,
            'xp_reward': 200
        },
        {
            'name': 'XP Legend',
            'description': 'Earn 2000 total XP',
            'icon': '👑',
            'condition': lambda u: u.xp >= 2000,
            'xp_reward': 500
        },
        {
            'name': 'Consistent Grinder',
            'description': 'Apply to co-ops for 7 consecutive days',
            'icon': '📅',
            'condition': lambda u: len(set([app.applied_date.date() for app in u.applications if app.applied_date])) >= 7,
            'xp_reward': 150
        },
        {
            'name': 'Diverse Applications',
            'description': 'Apply to 10 different companies',
            'icon': '🏢',
            'condition': lambda u: len(set([app.company for app in u.applications])) >= 10,
            'xp_reward': 125
        },
        {
            'name': 'Rejection Resilience',
            'description': 'Get rejected 10 times (but keep going!)',
            'icon': '💪',
            'condition': lambda u: len([app for app in u.applications if app.status == 'Rejected']) >= 10,
            'xp_reward': 100
        },
        {
            'name': 'Quick Success',
            'description': 'Get an offer within 5 applications',
            'icon': '🚀',
            'condition': lambda u: len(u.applications) <= 5 and len([app for app in u.applications if app.status == 'Offer']) >= 1,
            'xp_reward': 400
        },
        {
            'name': 'High Interview Rate',
            'description': 'Get interviews for 10% of your applications (min 4 apps)',
            'icon': '📊',
            'condition': lambda u: len(u.applications) >= 4 and (len([app for app in u.applications if app.status == 'Interviewing']) / len(u.applications)) >= 0.1,
            'xp_reward': 175
        },
        {
            'name': 'Perfect Streak',
            'description': 'Get 3 offers in a row',
            'icon': '🎯',
            'condition': lambda u: len([app for app in u.applications if app.status == 'Offer']) >= 3,
            'xp_reward': 600
        }
    ]