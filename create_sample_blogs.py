#!/usr/bin/env python3

import os
import django
import sys
from pathlib import Path

# Add the project directory to the Python path
project_dir = Path(__file__).resolve().parent / 'algovision-backend'
sys.path.append(str(project_dir))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.models import User
from blogs.models import Blog
from datetime import datetime, timedelta
import random

# Sample blog posts data
blog_posts = [
    {
        'title': 'My Journey into Software Development',
        'content': '''Starting my career as a software engineer has been an incredible journey. From learning my first programming language to building complex applications, every day brings new challenges and opportunities.

In this post, I want to share some insights about getting started in tech and the importance of continuous learning. The tech industry is constantly evolving, and staying updated with the latest technologies is crucial for success.

Key tips for aspiring developers:
1. Start with the basics - master fundamentals
2. Build projects - hands-on experience is invaluable  
3. Join communities - networking and learning from others
4. Never stop learning - technology evolves rapidly

What's your experience been like? Share in the comments! 🚀''',
        'author': 'arjun_sharma',
        'tags': ['programming', 'career', 'software-development']
    },
    {
        'title': 'The Art of UI/UX Design: Creating Meaningful Experiences',
        'content': '''Design is not just about making things look pretty. It's about solving problems and creating meaningful experiences for users.

As a UI/UX designer, I've learned that the best designs are invisible - they work so well that users don't even think about them. Here are some principles I follow:

🎨 **User-Centered Design**: Always design with your users in mind
📱 **Consistency**: Maintain consistent patterns across your interface
⚡ **Performance**: Beautiful designs mean nothing if they're slow
♿ **Accessibility**: Design for everyone, including users with disabilities

The future of design lies in understanding human psychology and behavior. Technology is just a tool - the real magic happens when we understand what people need.

What design trends are you excited about? Let me know your thoughts! ✨''',
        'author': 'priya_patel',
        'tags': ['design', 'ux', 'ui', 'user-experience']
    },
    {
        'title': 'Machine Learning in 2025: Trends and Predictions',
        'content': '''Machine Learning has come a long way, and 2025 is shaping up to be an exciting year for AI and ML innovations.

Here are the top trends I'm seeing:

🤖 **Large Language Models**: More efficient and specialized models
🔍 **Automated ML**: Making ML accessible to non-experts
🏥 **Healthcare AI**: Revolutionary applications in medical diagnosis
🌍 **Sustainable AI**: Focus on energy-efficient algorithms

The democratization of AI tools means that more people can leverage ML in their work. However, we must also be mindful of ethical considerations and bias in AI systems.

As data scientists, we have a responsibility to build fair and transparent systems. What are your thoughts on the future of AI ethics? 

#MachineLearning #AI #DataScience #TechTrends''',
        'author': 'rohit_gupta',
        'tags': ['machine-learning', 'ai', 'data-science', 'tech-trends']
    },
    {
        'title': 'Building Products That Users Love',
        'content': '''Product management is about finding the perfect balance between user needs, business goals, and technical feasibility.

After managing products for several years, here are my key learnings:

📊 **Data-Driven Decisions**: Let data guide your product decisions
👥 **User Feedback**: Regular user research is non-negotiable
🎯 **Clear Vision**: Everyone should understand the product vision
🚀 **Iterative Approach**: Build, measure, learn, repeat

The most successful products solve real problems for real people. It's not about having the most features - it's about having the right features that create value.

Remember: You're not building a product for yourself, you're building it for your users. Stay humble and keep learning from them.

What's your biggest product management challenge? Let's discuss! 💡''',
        'author': 'sneha_reddy',
        'tags': ['product-management', 'user-experience', 'business']
    },
    {
        'title': 'Full Stack Development: Best Practices and Tools',
        'content': '''Being a full stack developer means wearing multiple hats. Here's my toolkit and approach for 2025:

**Frontend:**
- React/Next.js for robust applications
- TypeScript for better code quality
- Tailwind CSS for rapid styling

**Backend:**
- Node.js with Express for APIs
- Python/Django for complex applications
- PostgreSQL for reliable data storage

**DevOps:**
- Docker for containerization
- GitHub Actions for CI/CD
- AWS/Vercel for deployment

**Key Principles:**
1. Write clean, maintainable code
2. Test everything that can break
3. Document your APIs
4. Security should never be an afterthought

The full stack landscape changes rapidly, but focusing on fundamentals and choosing the right tool for the job will always serve you well.

What's your favorite tech stack? Share your experiences below! 🔧''',
        'author': 'vikram_singh',
        'tags': ['full-stack', 'web-development', 'programming', 'tools']
    },
    {
        'title': 'Digital Marketing in the Age of AI',
        'content': '''Digital marketing is being transformed by AI and automation. Here's how I'm adapting my strategies:

🎯 **Personalization at Scale**: AI helps create personalized experiences for thousands of users
📈 **Predictive Analytics**: Understanding customer behavior before they act
🤖 **Chatbots & Automation**: 24/7 customer engagement
📱 **Voice Search Optimization**: Preparing for the voice-first future

**My Top Tips:**
- Focus on authentic storytelling
- Leverage data but don't lose the human touch
- Experiment with new platforms and formats
- Always measure and optimize

The brands that will succeed are those that use technology to enhance human connection, not replace it. AI is a powerful tool, but creativity and empathy remain uniquely human.

How are you incorporating AI into your marketing strategies? 🚀📊''',
        'author': 'kavya_nair',
        'tags': ['digital-marketing', 'ai', 'automation', 'branding']
    },
    {
        'title': 'From Idea to Startup: Lessons from the Trenches',
        'content': '''Building a startup is like riding a roller coaster blindfolded. Here are the hard truths I've learned:

💡 **Ideas are cheap, execution is everything**
Ideas are a dime a dozen. What matters is your ability to execute and adapt.

💰 **Cash flow is king**
You can have the best product in the world, but if you run out of money, game over.

👥 **Team is everything**
Hire slow, fire fast. The right team can overcome almost any obstacle.

📈 **Focus on metrics that matter**
Vanity metrics feel good but don't build businesses. Focus on revenue and user retention.

🔄 **Pivot when necessary**
Being stubborn about a failing idea is expensive. Listen to the market.

**Biggest Mistakes:**
- Building in isolation without user feedback
- Scaling too early
- Ignoring the competition
- Not having a clear business model

The startup journey is tough, but incredibly rewarding. What's your biggest entrepreneurial lesson? 🚀''',
        'author': 'aman_verma',
        'tags': ['startup', 'entrepreneurship', 'business', 'lessons']
    },
    {
        'title': 'The Power of Storytelling in Content Creation',
        'content': '''Every piece of content tells a story. As a content creator, I've learned that good storytelling can transform even the most mundane topics into engaging content.

📚 **Elements of Great Storytelling:**
- Strong opening that hooks the reader
- Relatable characters and situations  
- Clear conflict or challenge
- Satisfying resolution or insight

✍️ **Content Creation Tips:**
- Know your audience deeply
- Be authentic and vulnerable
- Use visuals to enhance your story
- Engage with your community

**My Writing Process:**
1. Research and outline thoroughly
2. Write the first draft quickly
3. Edit ruthlessly
4. Get feedback from others
5. Publish and promote strategically

The best content doesn't just inform - it transforms. It makes people think, feel, and act differently.

What stories are you telling through your content? Share your creative process! 📝✨''',
        'author': 'riya_agarwal',
        'tags': ['content-creation', 'storytelling', 'writing', 'blogging']
    },
    {
        'title': 'DevOps and Cloud Architecture: Building for Scale',
        'content': '''Modern applications need to be scalable, reliable, and secure. Here's my approach to DevOps and cloud architecture:

☁️ **Cloud-First Strategy:**
- Design for the cloud from day one
- Use managed services when possible
- Implement proper monitoring and logging

🔧 **Infrastructure as Code:**
- Terraform for infrastructure provisioning
- Ansible for configuration management
- Version control everything

📊 **Monitoring & Observability:**
- Comprehensive logging strategy
- Real-time monitoring and alerting
- Performance optimization

🔒 **Security Best Practices:**
- Zero-trust architecture
- Regular security audits
- Automated vulnerability scanning

**Key Lessons:**
- Automate everything that can be automated
- Plan for failure - build resilient systems
- Monitor proactively, not reactively
- Security is everyone's responsibility

The goal is to enable developers to focus on building features while the infrastructure handles scaling and reliability automatically.

What's your DevOps challenge? Let's solve it together! 🛠️''',
        'author': 'karthik_rao',
        'tags': ['devops', 'cloud', 'infrastructure', 'scaling']
    },
    {
        'title': 'React Development: Tips from the Frontend Trenches',
        'content': '''React has revolutionized frontend development. Here are my top tips for building better React applications:

⚛️ **Component Best Practices:**
- Keep components small and focused
- Use custom hooks for reusable logic
- Implement proper error boundaries
- Optimize re-renders with useMemo and useCallback

🎨 **State Management:**
- Start with useState and useContext
- Consider Redux for complex state
- Use React Query for server state
- Keep state as close to where it's used as possible

🚀 **Performance Optimization:**
- Code splitting with React.lazy
- Implement proper loading states
- Use React DevTools Profiler
- Optimize bundle size

📱 **Modern Development:**
- TypeScript for better developer experience
- Testing with Jest and React Testing Library
- Storybook for component development
- ESLint and Prettier for code quality

The React ecosystem is vast and evolving. Focus on fundamentals first, then gradually adopt new patterns and tools as needed.

What's your favorite React pattern? Share your tips! ⚛️💫''',
        'author': 'ananya_singh',
        'tags': ['react', 'frontend', 'javascript', 'web-development']
    },
    {
        'title': 'Python for Backend Development: A Complete Guide',
        'content': '''Python continues to be one of the most popular choices for backend development. Here's why and how to use it effectively:

🐍 **Why Python for Backend:**
- Clean, readable syntax
- Extensive library ecosystem
- Strong community support
- Great for rapid prototyping

🛠️ **Essential Frameworks:**
- Django for full-featured applications
- FastAPI for modern, fast APIs
- Flask for lightweight applications
- Celery for background tasks

📊 **Database Integration:**
- Django ORM for complex queries
- SQLAlchemy for flexibility
- Alembic for migrations
- Redis for caching

🔐 **Security Considerations:**
- Input validation and sanitization
- Proper authentication and authorization
- HTTPS everywhere
- Regular dependency updates

**Development Workflow:**
1. Virtual environments for isolation
2. Requirements.txt for dependencies
3. Unit tests with pytest
4. Code quality with black and flake8

Python's simplicity doesn't mean sacrificing power. With the right tools and practices, you can build robust, scalable backend systems.

What's your Python development setup? 🚀''',
        'author': 'rajesh_kumar',
        'tags': ['python', 'backend', 'django', 'api-development']
    },
    {
        'title': 'Visual Design Trends That Actually Matter',
        'content': '''Design trends come and go, but some have lasting impact. As a graphic designer, here are the trends I'm watching:

🎨 **Design Trends 2025:**
- Minimalism with personality
- Bold typography combinations
- Sustainable design practices
- Interactive and motion graphics

🌈 **Color Psychology:**
- Warm, earthy tones for authenticity
- High contrast for accessibility
- Brand colors that tell stories
- Color systems that scale

🖼️ **Visual Hierarchy:**
- Clear information architecture
- Consistent spacing and alignment
- Strategic use of white space
- Typography that guides the eye

**Tools I Use:**
- Figma for UI/UX design
- Adobe Creative Suite for graphics
- Procreate for illustrations
- Principle for prototyping

The best designs solve problems while creating emotional connections. Trends are just tools - the real skill is knowing when and how to use them.

What design trend do you think will have the biggest impact? Let's discuss! 🎨✨''',
        'author': 'meera_joshi',
        'tags': ['graphic-design', 'visual-design', 'trends', 'creativity']
    }
]

def create_sample_blogs():
    print("Creating sample blog posts...")
    
    created_blogs = []
    
    for blog_data in blog_posts:
        try:
            # Get the author
            author = User.objects.get(username=blog_data['author'])
            
            # Create blog post
            blog = Blog.objects.create(
                title=blog_data['title'],
                content=blog_data['content'],
                author=author,
                created_at=datetime.now() - timedelta(days=random.randint(1, 30)),
                tags=', '.join(blog_data['tags'])
            )
            
            created_blogs.append(blog)
            print(f"Created blog: '{blog.title}' by {author.full_name}")
            
        except User.DoesNotExist:
            print(f"User {blog_data['author']} not found, skipping blog post")
            continue
    
    return created_blogs

def print_blog_summary(blogs):
    print("\n" + "="*60)
    print("SAMPLE BLOG POSTS CREATED")
    print("="*60)
    
    for blog in blogs:
        print(f"Title: {blog.title}")
        print(f"Author: {blog.author.full_name} (@{blog.author.username})")
        print(f"Tags: {blog.tags}")
        print(f"Created: {blog.created_at.strftime('%Y-%m-%d')}")
        print("-"*60)

if __name__ == "__main__":
    try:
        # Create sample blog posts
        blogs = create_sample_blogs()
        
        # Print summary
        print_blog_summary(blogs)
        
        print(f"\n✅ Successfully created {len(blogs)} sample blog posts!")
        print("You can now test the platform with realistic content.")
        
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
