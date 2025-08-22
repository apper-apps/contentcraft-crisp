import contentData from "@/services/mockData/content.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ContentService {
  constructor() {
    this.contents = [...contentData];
  }

  // Filter content by tenant
  filterByTenant(contents, tenantId) {
    if (!tenantId) return contents;
    return contents.filter(content => content.tenantId === tenantId);
  }

  async getAll(tenantId = null) {
    await delay(300);
    const allContents = [...this.contents];
    return tenantId ? this.filterByTenant(allContents, tenantId) : allContents;
  }


  async getById(id) {
    await delay(150);
    const content = this.contents.find(c => c.Id === parseInt(id));
    if (!content) {
      throw new Error(`Content with ID ${id} not found`);
    }
    return { ...content };
}

  async create(contentData) {
    await delay(400);
    const newContent = {
      Id: this.contents.length > 0 ? Math.max(...this.contents.map(c => c.Id)) + 1 : 1,
      input: contentData.input,
      preset: contentData.preset,
      provider: contentData.provider || "OpenAI GPT-4",
      brandId: contentData.brandId,
      tenantId: contentData.tenantId,
      outputCount: contentData.types ? contentData.types.length : 4,
      wordCount: Math.floor(Math.random() * 2000) + 800,
      createdAt: new Date().toISOString(),
      outputs: {}
    };
    this.contents.push(newContent);
    return { ...newContent };
  }

  async update(id, contentData) {
    await delay(250);
    const index = this.contents.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Content with ID ${id} not found`);
    }
    
    this.contents[index] = {
      ...this.contents[index],
      ...contentData,
      Id: parseInt(id)
    };
    return { ...this.contents[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.contents.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Content with ID ${id} not found`);
    }
    
    this.contents.splice(index, 1);
    return { success: true };
  }

  async generateContent(contentData, type) {
    await delay(800 + Math.random() * 1200); // Simulate AI processing time

    const sampleOutputs = {
      youtube_description: this.generateYouTubeDescription(contentData),
      blog_post: this.generateBlogPost(contentData),
      forum_post: this.generateForumPost(contentData),
      seo_tags: this.generateSEOTags(contentData),
      timestamps: this.generateTimestamps(contentData),
      voice_analysis: this.generateVoiceAnalysis(contentData),
      social_posts: this.generateSocialPosts(contentData),
email_newsletter: this.generateEmailNewsletter(contentData)
    };
    
    return sampleOutputs[type] || `Generated ${type} content based on: ${contentData?.input?.slice(0, 100) || 'provided content'}...`;
  }
  generateYouTubeDescription(data) {
    return `🚀 ${data.preset} - Transform Your Content Strategy!

Discover powerful techniques to elevate your content game with this comprehensive guide. Perfect for creators, marketers, and businesses looking to maximize their impact.

✅ What You'll Learn:
• Advanced content strategies
• Audience engagement techniques  
• Performance optimization tips
• Real-world implementation examples

🎯 Who This Is For:
• Content creators
• Digital marketers
• Business owners
• Marketing professionals

📈 Key Benefits:
• Increased engagement rates
• Better audience targeting
• Improved content ROI
• Stronger brand presence

💡 Key Takeaway: ${data?.input?.slice(0, 150) || 'your content strategy'}...

🔔 Subscribe for more content marketing insights!

#ContentMarketing #DigitalStrategy #MarketingTips #BusinessGrowth`;
  }

  generateBlogPost(data) {
    return `# ${data.preset}: A Comprehensive Guide

## Introduction
This comprehensive forum post explores the key insights from your content:
${data?.input || 'your provided content'}

This comprehensive approach to content strategy has proven effective across various industries and can be adapted to meet your specific business needs.

## Key Strategies

### 1. Understanding Your Audience
- Conduct thorough audience research
- Create detailed buyer personas
- Analyze engagement patterns
- Monitor feedback and responses

### 2. Content Planning and Creation
- Develop a content calendar
- Focus on quality over quantity
- Maintain consistent brand voice
- Optimize for search engines

### 3. Distribution and Promotion
- Leverage multiple channels
- Engage with your community
- Use data to guide decisions
- Continuously test and optimize

## Implementation Tips

To successfully implement these strategies:

1. **Start Small**: Begin with one or two key initiatives
2. **Measure Results**: Track important metrics regularly
3. **Stay Consistent**: Maintain regular publishing schedule
4. **Adapt Quickly**: Be ready to pivot based on performance

## Conclusion

By following these proven strategies and maintaining a focus on providing value to your audience, you can build a content marketing system that drives real business results.

Remember: consistency and quality are more important than perfection. Start where you are, use what you have, and do what you can.`;
  }

  generateForumPost(data) {
    return `**${data.preset} - Sharing My Experience**
Hey everyone! 👋

I wanted to share some insights about ${data?.input?.slice(0, 100) || 'the latest content marketing trends'}...
**What I've Learned:**
- Implementation requires patience and consistency
- Results may take time but are worth the effort
- Community feedback is invaluable for improvement

**My Results So Far:**
• Increased engagement by 40%
• Better audience understanding
• More effective content strategy

**Questions for the Community:**
1. Has anyone tried similar approaches?
2. What challenges did you face during implementation?
3. Any additional tips or resources to share?

Looking forward to hearing your thoughts and experiences!

**TL;DR:** Sharing successful content strategy implementation and looking for community insights and experiences.

#ContentMarketing #Strategy #CommunityDiscussion`;
  }

  generateSEOTags(data) {
    const baseKeywords = [
      "content marketing",
      "digital strategy", 
      "audience engagement",
      "content creation",
      "marketing optimization"
    ];

    const additionalKeywords = [
      "SEO optimization",
      "content strategy",
      "marketing ROI",
      "brand awareness",
      "social media marketing",
      "content planning",
      "audience targeting",
      "content distribution",
      "marketing analytics",
      "conversion optimization"
    ];

    return [...baseKeywords, ...additionalKeywords.slice(0, 10)].join(", ");
  }

  generateTimestamps(data) {
    return `00:00 - Introduction and Overview
02:15 - Key Concepts Explained
04:30 - Strategy Implementation
06:45 - Real-World Examples
09:00 - Common Challenges and Solutions
11:20 - Best Practices and Tips
13:35 - Tools and Resources
15:50 - Results and Measurements
17:25 - Q&A and Community Discussion
19:40 - Conclusion and Next Steps`;
  }

  generateVoiceAnalysis(data) {
    return `**Voice and Tone Analysis**

**Overall Tone:** Professional yet approachable, informative with engaging elements

**Key Characteristics:**
- **Confidence Level:** High - demonstrates expertise and authority
- **Engagement Style:** Interactive and community-focused
- **Information Density:** Well-balanced between detail and accessibility
- **Emotional Tone:** Optimistic and encouraging

**Strengths:**
• Clear communication of complex concepts
• Strong use of actionable language
• Good balance of professional and conversational elements
• Effective use of examples and practical applications

**Recommendations for Consistency:**
1. Maintain the informative yet accessible approach
2. Continue using specific examples and metrics
3. Keep the encouraging and actionable tone
4. Balance professional expertise with relatability

**Target Audience Alignment:** Excellent match for professionals seeking practical, implementable strategies with proven results.`;
  }

  generateSocialPosts(data) {
    return `**LinkedIn Post:**
🚀 Just discovered a game-changing approach to content strategy! The key insights:
✅ Focus on audience value first
✅ Consistency beats perfection
✅ Data-driven optimization is essential

What's your biggest content marketing challenge? Share in the comments! 
#ContentMarketing #Strategy #BusinessGrowth

**Twitter Thread:**
🧵 Thread: Content strategy that actually works (1/5)

The secret isn't creating more content—it's creating the RIGHT content for your audience.

Here's what I learned after implementing this approach: 👇

2/5 First, understand your audience deeply. Not just demographics, but their real pain points and motivations.

3/5 Then, create content that solves specific problems. Value-first always wins.

4/5 Finally, measure everything and optimize based on data, not assumptions.

5/5 Result: 40% increase in engagement and significantly better ROI.

What's been your experience with content strategy? 

**Instagram Caption:**
Transform your content game with these proven strategies! 💪✨

Swipe to see the key insights that changed everything for my content approach:
• Audience research is everything
• Quality over quantity always wins
• Consistency is your best friend
• Data guides better decisions

Which tip resonates most with you? Drop a comment below! 👇

#ContentCreator #MarketingTips #DigitalStrategy #ContentMarketing`;
  }

  generateEmailNewsletter(data) {
    return `Subject: The Content Strategy That Changed Everything (40% Better Results!)

Hi [First Name],

Hope your week is going great! 

I wanted to share something that's been a complete game-changer for my content approach...

**The One Thing That Made All the Difference**

After implementing this comprehensive content strategy, I saw a 40% improvement in engagement across all platforms. But here's what surprised me most:

It wasn't about creating MORE content—it was about creating the RIGHT content.

**The 3-Step Framework:**

1️⃣ **Deep Audience Research**
   - Go beyond demographics
   - Understand real pain points
   - Listen to actual language they use

2️⃣ **Value-First Creation**
   - Solve specific problems
   - Share actionable insights
   - Make it immediately useful

3️⃣ **Data-Driven Optimization**  
   - Track the right metrics
   - Test different approaches
   - Double down on what works

**Real Results:**
• 40% increase in engagement
• Better audience connection
• More efficient content creation
• Stronger brand positioning

**Your Turn:**
What's your biggest content challenge right now? Hit reply and let me know—I read every response!

**P.S.** Next week, I'll share the specific tools I use to implement this strategy. Stay tuned!

Best,
[Your Name]

---
If this was helpful, forward it to a friend who might benefit!
[Unsubscribe] | [Update Preferences]`;
  }
async getByTenant(tenantId) {
    await delay(200);
    return this.filterByTenant(this.contents, tenantId);
  }
}

export const contentService = new ContentService();