const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ContentService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'content_c';
  }

  async getAll(tenantId = null) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "input_c" } },
          { field: { Name: "preset_c" } },
          { field: { Name: "provider_c" } },
          { field: { Name: "output_count_c" } },
          { field: { Name: "word_count_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "outputs_c" } },
          { field: { Name: "brand_id_c" } },
          { field: { Name: "tenant_id_c" } }
        ]
      };

      if (tenantId) {
        params.where = [
          {
            FieldName: "tenant_id_c",
            Operator: "EqualTo",
            Values: [parseInt(tenantId)]
          }
        ];
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching content:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "input_c" } },
          { field: { Name: "preset_c" } },
          { field: { Name: "provider_c" } },
          { field: { Name: "output_count_c" } },
          { field: { Name: "word_count_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "outputs_c" } },
          { field: { Name: "brand_id_c" } },
          { field: { Name: "tenant_id_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response || !response.data) {
        throw new Error(`Content with ID ${id} not found`);
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching content with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async create(contentData) {
    try {
      const params = {
        records: [
          {
            Name: contentData.Name || contentData.preset_c || "Generated Content",
            Tags: contentData.Tags || "",
            input_c: contentData.input_c,
            preset_c: contentData.preset_c,
            provider_c: contentData.provider_c || "OpenAI GPT-4",
            brand_id_c: parseInt(contentData.brand_id_c),
            tenant_id_c: parseInt(contentData.tenant_id_c),
            output_count_c: contentData.output_count_c || 4,
            word_count_c: contentData.word_count_c || Math.floor(Math.random() * 2000) + 800,
            created_at_c: new Date().toISOString(),
            outputs_c: JSON.stringify(contentData.outputs_c || {})
          }
        ]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create content ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to create content");
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating content:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async update(id, contentData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            Name: contentData.Name,
            Tags: contentData.Tags,
            input_c: contentData.input_c,
            preset_c: contentData.preset_c,
            provider_c: contentData.provider_c,
            brand_id_c: parseInt(contentData.brand_id_c),
            tenant_id_c: parseInt(contentData.tenant_id_c),
            output_count_c: contentData.output_count_c,
            word_count_c: contentData.word_count_c,
            outputs_c: typeof contentData.outputs_c === 'string' ? contentData.outputs_c : JSON.stringify(contentData.outputs_c)
          }
        ]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update content ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error("Failed to update content");
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating content:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return { success: true };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting content:", error?.response?.data?.message);
      } else {
        console.error(error);
      }
      throw error;
    }
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
    
    return sampleOutputs[type] || `Generated ${type} content based on: ${contentData?.input_c?.slice(0, 100) || 'provided content'}...`;
  }
  
  generateYouTubeDescription(data) {
    return `🚀 ${data.preset_c} - Transform Your Content Strategy!

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

💡 Key Takeaway: ${data?.input_c?.slice(0, 150) || 'your content strategy'}...

🔔 Subscribe for more content marketing insights!

#ContentMarketing #DigitalStrategy #MarketingTips #BusinessGrowth`;
  }

  generateBlogPost(data) {
    return `# ${data.preset_c}: A Comprehensive Guide

## Introduction
This comprehensive forum post explores the key insights from your content:
${data?.input_c || 'your provided content'}

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
    return `**${data.preset_c} - Sharing My Experience**
Hey everyone! 👋

I wanted to share some insights about ${data?.input_c?.slice(0, 100) || 'the latest content marketing trends'}...
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
    return this.getAll(tenantId);
  }
}

export const contentService = new ContentService();

export const contentService = new ContentService();