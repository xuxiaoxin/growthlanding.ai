import type { SSEEvent, LandingPage, ParsedProduct, Trend, KeywordGroup } from "@/types";

export const DEMO_PRODUCT_DESCRIPTION = "A tool that helps teachers grade student essays using AI, supporting multiple languages, auto-scoring, and personalized feedback";

export const DEMO_PARSED_PRODUCT: ParsedProduct = {
  productName: "AI Essay Grader",
  category: "AI Education Tool",
  coreKeywords: ["AI grading", "essay scoring", "edtech", "auto-grading", "personalized feedback"],
  userIntent: "Help teachers improve grading efficiency and provide instant, personalized writing feedback to students",
  targetAudience: "K-12 teachers, educational institutions, writing tutors",
  keyFeatures: ["Multi-language support", "Auto-scoring", "Personalized feedback", "Grading reports", "Grammar correction"],
  competitors: ["Grammarly", "Turnitin", "Gradescope"],
};

export const DEMO_TRENDS: Trend[] = [
  { name: "DeepSeek", description: "Open-source LLM rivaling GPT-4 performance", searchIntent: "DeepSeek capabilities, education applications" },
  { name: "AI Education", description: "AI applications in education, personalized learning, smart grading", searchIntent: "AI education tools, effectiveness, future trends" },
  { name: "ChatGPT", description: "OpenAI's flagship conversational AI model", searchIntent: "Teaching applications, writing assistance" },
  { name: "Prompt Engineering", description: "The art of crafting prompts to optimize AI output quality", searchIntent: "Prompt tips, educational applications" },
  { name: "Claude", description: "Anthropic's AI assistant with strong long-context analysis", searchIntent: "Long-text analysis, education scenarios" },
  { name: "AI Automation", description: "AI-driven business process automation", searchIntent: "Teacher workflow automation" },
  { name: "AI Writing", description: "AI-assisted content creation", searchIntent: "AI writing tools, teaching assistance" },
  { name: "AI Agent", description: "Autonomous AI agents for complex tasks", searchIntent: "Education agents, auto-grading" },
  { name: "Knowledge Base", description: "AI-enhanced knowledge management systems", searchIntent: "Teaching knowledge base, question bank management" },
  { name: "RAG", description: "Retrieval-Augmented Generation technology", searchIntent: "RAG education applications, intelligent Q&A" },
];

export const DEMO_KEYWORD_GROUPS: KeywordGroup[] = DEMO_TRENDS.map((trend) => ({
  trend,
  keywords: [
    `${trend.name} essay grading tool`,
    `${trend.name} for teachers`,
    `AI grading with ${trend.name}`,
  ],
}));

export const DEMO_PAGES: LandingPage[] = [
  {
    id: "demo-1",
    trend: DEMO_TRENDS[0],
    keyword: "DeepSeek essay grading tool",
    title: "DeepSeek Essay Grading Tool: How AI Helps Teachers Boost Grading Efficiency 10x",
    metaDescription: "Learn how to leverage the DeepSeek LLM for intelligent essay grading with auto-scoring, grammar correction, and personalized feedback. Save 80% grading time.",
    slug: "deepseek-essay-grading-tool",
    h1: "AI Essay Grading with DeepSeek: The Ultimate Teacher Efficiency Tool",
    content: `<h2>Why Teachers Need AI Essay Grading Tools</h2>
<p>Every language arts teacher knows that grading essays is one of the most time-consuming tasks. A class of 30 essays at 10-15 minutes each adds up to nearly 8 hours of work. The emergence of <strong>DeepSeek</strong>, an open-source large language model, has made AI essay grading a reality.</p>
<p>DeepSeek excels in English text understanding and writing analysis. It can accurately identify grammar errors and evaluate essays across multiple dimensions including content, structure, and logic.</p>

<h2>Key Advantages of DeepSeek Essay Grading</h2>
<p>Compared to traditional manual grading, DeepSeek-powered AI grading offers these benefits:</p>
<ul>
<li><strong>10x Speed Improvement</strong>: Grade an 800-word essay in 1 minute instead of 10</li>
<li><strong>Scoring Consistency</strong>: AI uses standardized rubrics, eliminating subjective bias</li>
<li><strong>Personalized Feedback</strong>: Tailored improvement suggestions based on each student's writing level</li>
<li><strong>Multi-dimensional Analysis</strong>: Evaluate language expression, logical structure, and content depth</li>
</ul>

<h2>Real-World Application</h2>
<p>After implementing DeepSeek essay grading at a leading high school, teacher grading efficiency improved by 80%, and student satisfaction with feedback jumped from 60% to 92%. Students reported that AI feedback was more detailed and actionable, helping them improve their writing skills faster.</p>
<p>The system also auto-generates class-wide writing proficiency reports, helping teachers understand overall performance and adjust their teaching strategies accordingly.</p>`,
    faq: [
      { question: "Is DeepSeek accurate for grading essays?", answer: "DeepSeek achieves over 95% accuracy in essay grading, particularly excelling in grammar correction and logical analysis. We recommend using AI grading as an assistive tool alongside final teacher review." },
      { question: "How do I get started with DeepSeek essay grading?", answer: "Simply sign up for an account, upload student essays (supports images and text), and the system completes grading within 1 minute with detailed feedback." },
      { question: "What types of essays can DeepSeek grade?", answer: "It supports all common essay types for K-12 and beyond, including narrative, argumentative, expository, and creative writing, as well as multilingual essay grading." },
    ],
    cta: { text: "Try AI Essay Grading Free", url: "https://example.com" },
  },
  {
    id: "demo-2",
    trend: DEMO_TRENDS[1],
    keyword: "AI education essay grading tools 2026",
    title: "Best AI Education Essay Grading Tools in 2026: Make Grading Easy and Efficient",
    metaDescription: "Discover the top AI education essay grading tools of 2026. Compare features, pricing, and user experience to find the perfect smart grading solution for your classroom.",
    slug: "ai-education-essay-grading-tools",
    h1: "The Complete Guide to AI Education Essay Grading Tools in 2026",
    content: `<h2>AI Education Tools Are Transforming Teaching</h2>
<p>As AI technology deepens its footprint in education, <strong>intelligent essay grading</strong> has become one of the most popular AI features among teachers. From auto-scoring to personalized feedback, AI is redefining what "grading" means.</p>
<p>According to recent surveys, over 30% of teachers worldwide now use AI tools in their daily teaching, with essay grading tools seeing the fastest adoption growth at 150% year-over-year.</p>

<h2>Core Features of AI Essay Grading Tools</h2>
<p>A top-tier AI essay grading tool should offer:</p>
<ul>
<li><strong>Multi-dimensional Scoring</strong>: Independent scores for content, structure, language, and creativity</li>
<li><strong>Real-time Feedback</strong>: Students receive grading results within seconds of submission</li>
<li><strong>Error Annotation</strong>: Precise highlighting of grammar errors, word choice issues, and logical problems</li>
<li><strong>Improvement Suggestions</strong>: Specific, actionable recommendations with example references for each issue</li>
</ul>

<h2>How to Choose the Right Tool</h2>
<p>When selecting an AI grading tool, consider these factors: grading accuracy, supported essay types, feedback quality, pricing, and data security. For K-12 teachers, we recommend tools specifically optimized for English language arts curriculum standards.</p>`,
    faq: [
      { question: "Will AI education tools replace teachers?", answer: "No. AI tools are designed to assist teachers, freeing them from repetitive tasks so they can focus on creative teaching and meaningful student interactions." },
      { question: "What grade levels are AI grading tools suitable for?", answer: "They work for all levels from elementary through high school. Quality tools automatically adjust scoring standards and feedback style based on grade level." },
      { question: "Do I need technical skills to use AI grading tools?", answer: "Not at all. Most tools are web-based or app-based, as easy to use as any everyday application." },
    ],
    cta: { text: "Experience AI Smart Grading", url: "https://example.com" },
  },
  {
    id: "demo-3",
    trend: DEMO_TRENDS[2],
    keyword: "ChatGPT essay grading method",
    title: "Grading Essays with ChatGPT: A Practical Guide for Teachers",
    metaDescription: "Step-by-step guide to using ChatGPT for grading student essays, including prompt templates, rubric setup, and real-world examples. Boost your grading workflow today.",
    slug: "chatgpt-essay-grading-guide",
    h1: "ChatGPT Essay Grading: From Beginner to Expert",
    content: `<h2>Can ChatGPT Grade Essays?</h2>
<p>The answer is yes. <strong>ChatGPT</strong>, the world's most widely used AI conversational model, has powerful text understanding and analysis capabilities. With the right prompt design, ChatGPT can become a valuable essay grading assistant for teachers.</p>
<p>However, using ChatGPT directly for grading has limitations: lack of standardized rubrics, no batch processing, and potential privacy concerns. A dedicated grading tool built on ChatGPT's capabilities is the better choice.</p>

<h2>ChatGPT Grading Prompt Templates</h2>
<p>Here are some practical prompt templates:</p>
<ul>
<li><strong>General Grading</strong>: Grade the following essay as an experienced English teacher, scoring across four dimensions: Content (40%), Structure (20%), Language (30%), Creativity (10%)</li>
<li><strong>Grammar Check</strong>: Identify all grammar errors and inappropriate word choices in the following essay, with correction suggestions</li>
<li><strong>Improvement Tips</strong>: Analyze the strengths and weaknesses of this essay and provide three specific improvement recommendations</li>
</ul>

<h2>Dedicated Tool vs Manual Prompts</h2>
<p>While writing prompts manually achieves basic grading, dedicated AI grading tools excel at: preset rubrics, batch processing, student portfolio management, and class analytics. For efficient, reliable grading, a dedicated tool is the way to go.</p>`,
    faq: [
      { question: "Is ChatGPT grading free?", answer: "The free version of ChatGPT handles basic grading, but GPT-4 level deep analysis requires a paid subscription. Dedicated grading tools often offer better value." },
      { question: "How accurate is ChatGPT at grading?", answer: "Grammar correction accuracy is about 90%; content evaluation and creativity scoring accuracy is around 75-80%. Best used as a supplementary tool." },
      { question: "Will student essays be used to train AI?", answer: "ChatGPT's API allows users to opt out of data training, but the web version can't guarantee this. Dedicated education tools typically have stricter data protection." },
    ],
    cta: { text: "Try a More Professional Grading Tool", url: "https://example.com" },
  },
  {
    id: "demo-4",
    trend: DEMO_TRENDS[3],
    keyword: "prompt engineering essay feedback",
    title: "Prompt Engineering for Essay Grading: Get More Precise AI Writing Feedback",
    metaDescription: "Master Prompt Engineering techniques to get more precise and constructive AI feedback on student essays. Improve writing outcomes with better prompts.",
    slug: "prompt-engineering-essay-feedback",
    h1: "How Prompt Engineering Makes AI Essay Grading More Precise",
    content: `<h2>Prompt Engineering Is Key to AI Grading</h2>
<p><strong>Prompt Engineering</strong> is the single most important factor affecting AI output quality. The same AI model can produce wildly different grading results with different prompts. Mastering prompt techniques is essential for high-quality AI grading.</p>
<p>Research shows that optimized prompts can boost AI grading accuracy from 70% to over 95%, and triple the usefulness of feedback.</p>

<h2>Prompt Design Principles for Essay Grading</h2>
<ul>
<li><strong>Role Assignment</strong>: Tell the AI it's an English teacher with 20 years of experience</li>
<li><strong>Clear Rubrics</strong>: Provide specific scoring dimensions and weights</li>
<li><strong>Output Format</strong>: Specify the feedback structure, e.g., Strengths → Areas for Improvement → Suggestions</li>
<li><strong>Tone Setting</strong>: Encouraging tone that avoids overly harsh criticism</li>
</ul>

<h2>Advanced: Building a Prompt Template Library</h2>
<p>Create different prompt templates for different essay types (narrative, argumentative, expository). Each type has different scoring priorities—narrative focuses on plot and description, argumentative on reasoning and logic. A well-built prompt template library ensures consistent, high-quality grading.</p>`,
    faq: [
      { question: "What if I don't know how to write prompts?", answer: "Professional AI grading tools come with pre-optimized prompt templates. No writing needed—the tool automatically selects the best prompt based on essay type and student grade level." },
      { question: "Is Prompt Engineering hard to learn?", answer: "Basic techniques can be learned in 1-2 hours. The core principles are: assign a role, provide rubrics, define format, set tone." },
      { question: "Are there ready-made grading prompt templates?", answer: "Many templates are shared online, but quality varies widely. We recommend using the built-in templates from dedicated tools, which are validated against large datasets for consistent results." },
    ],
    cta: { text: "Use a Tool with Built-in Optimized Prompts", url: "https://example.com" },
  },
  {
    id: "demo-5",
    trend: DEMO_TRENDS[4],
    keyword: "Claude long-text essay analysis",
    title: "Claude AI Essay Grading: Deep Analysis with Long-Context Capabilities",
    metaDescription: "Leverage Claude's long-context analysis capabilities for in-depth essay evaluation and personalized feedback. More comprehensive than traditional grading methods.",
    slug: "claude-ai-essay-analysis",
    h1: "Claude AI: Setting a New Standard for Long-Form Essay Analysis",
    content: `<h2>Claude's Long-Context Advantage</h2>
<p><strong>Claude</strong>, developed by Anthropic, is renowned for its exceptional long-text processing capabilities. This advantage is particularly valuable in essay grading—it can analyze all aspects of a complete essay simultaneously, rather than processing it fragment by fragment.</p>
<p>For a high school student's 1500-word argumentative essay, Claude can perform a comprehensive evaluation covering thesis analysis, argumentation logic, evidence quality, and language expression—all in one pass.</p>

<h2>Claude vs Other AI Grading Solutions</h2>
<p>Claude's unique advantages for essay grading include: superior context understanding (remembering the full essay for holistic evaluation), nuanced language analysis (catching subtle expression issues), and safer outputs (avoiding inappropriate content).</p>
<ul>
<li><strong>Thesis Analysis</strong>: Accurately identifies the relationship between central and supporting arguments</li>
<li><strong>Argument Evaluation</strong>: Analyzes the completeness and logic of argument chains</li>
<li><strong>Language Appreciation</strong>: Recognizes and encourages eloquent expression</li>
</ul>

<h2>Real-World Case Study</h2>
<p>An educational institution using a Claude-based grading system found its argumentative essay analysis depth exceeded that of most student teachers, especially in argumentation logic analysis. Students using Claude's feedback improved their argumentation skills by an average of 23%.</p>`,
    faq: [
      { question: "How long of an essay can Claude grade?", answer: "Claude supports ultra-long text analysis—essays of 3000+ words are processed completely without truncation." },
      { question: "What's Claude's grading style like?", answer: "Claude's grading style tends to be detailed and encouraging, thoroughly noting both strengths and areas for improvement with specific guidance." },
      { question: "What scenarios is Claude grading best for?", answer: "Particularly suited for writing that requires deep analysis: argumentative essays, research papers, literary criticism, and academic writing." },
    ],
    cta: { text: "Experience Deep Essay Analysis", url: "https://example.com" },
  },
  {
    id: "demo-6",
    trend: DEMO_TRENDS[5],
    keyword: "AI automation teacher grading workflow",
    title: "AI Automation for Teacher Grading: From Manual Markup to Smart Workflow",
    metaDescription: "Discover how AI automation is reshaping the teacher grading workflow, enabling full automation from collection to feedback. Save hours every week.",
    slug: "ai-automation-teaching-workflow",
    h1: "AI Automation: The Complete Upgrade to Teacher Grading Workflows",
    content: `<h2>The Pain Points of Manual Grading</h2>
<p>The traditional grading workflow: collect assignments → read each one → manually annotate → write comments → log grades → return to students. The entire process is tedious, repetitive, and time-consuming. <strong>AI automation</strong> can completely change this.</p>
<p>Surveys show teachers spend an average of 15-20 hours per week on grading and feedback—35% of their total work time. This time could be better spent on lesson planning, professional development, or student interaction.</p>

<h2>The AI-Automated Grading Workflow</h2>
<ul>
<li><strong>Step 1 - Smart Collection</strong>: Students submit essays through the platform, with automatic OCR for handwritten work</li>
<li><strong>Step 2 - AI Grading</strong>: System automatically performs multi-dimensional scoring and detailed annotation</li>
<li><strong>Step 3 - Teacher Review</strong>: Teachers review and fine-tune AI grading results</li>
<li><strong>Step 4 - Auto Feedback</strong>: System sends personalized feedback to students and parents</li>
</ul>

<h2>Efficiency Gains</h2>
<p>After implementing AI automation, teacher grading time dropped by 80%, while students receive feedback in 10 minutes instead of the average 3 days. Even better, AI grading detail surpasses most teachers' manual annotations.</p>`,
    faq: [
      { question: "Is setting up an AI grading workflow complicated?", answer: "Not at all. Modern AI grading tools are ready-to-use SaaS products—just sign up and start. No technical deployment required." },
      { question: "How do teachers ensure AI grading quality?", answer: "We recommend an AI grading + teacher review model. AI handles initial grading, then teachers quickly review and adjust, ensuring both efficiency and quality." },
      { question: "Can students and parents accept AI grading?", answer: "Research shows that when AI feedback is sufficiently detailed and constructive, acceptance rates exceed 90%. The key is helping students understand AI is an assistive tool with teacher oversight." },
    ],
    cta: { text: "Build Your AI Grading Workflow", url: "https://example.com" },
  },
  {
    id: "demo-7",
    trend: DEMO_TRENDS[6],
    keyword: "AI writing scoring tools comparison",
    title: "AI Writing Scoring Tools Compared: Which Is Best for Essay Grading?",
    metaDescription: "Comprehensive comparison of top AI writing scoring tools. We evaluate accuracy, features, pricing, and ease of use to help you find the best AI grading solution.",
    slug: "ai-writing-scoring-tools-comparison",
    h1: "AI Writing Scoring Tools Compared: Find Your Ideal Grading Solution",
    content: `<h2>The AI Writing Scoring Landscape</h2>
<p>In 2026, <strong>AI writing assessment</strong> has become one of the hottest sectors in edtech. Numerous tools have emerged, from general AI assistants to specialized education platforms—making the choice overwhelming.</p>
<p>Not all tools are equally suited for essay grading. Many international tools underperform in English academic contexts, while domestic options vary widely in quality.</p>

<h2>Key Evaluation Criteria</h2>
<p>We evaluate popular tools across these dimensions:</p>
<ul>
<li><strong>Grading Accuracy</strong>: Precision in grammar correction, content evaluation, and logical analysis</li>
<li><strong>Feedback Quality</strong>: Detail level, actionability, and encouraging tone</li>
<li><strong>Language Support</strong>: Understanding of grammar, idioms, and rhetorical devices</li>
<li><strong>Batch Processing</strong>: Ability to grade an entire class at once</li>
<li><strong>Pricing</strong>: Free tiers, paid plans, and overall value</li>
</ul>

<h2>Our Recommendation</h2>
<p>For K-12 teachers, we recommend tools specifically optimized for English language arts. These tools typically include rubrics aligned with curriculum standards and a deep understanding of standardized test essay requirements.</p>`,
    faq: [
      { question: "Are free AI grading tools sufficient?", answer: "Free tools work for occasional use and testing, but for consistent, high-volume grading, a paid plan is recommended. Monthly costs typically range from $10-30." },
      { question: "How do I evaluate an AI grading tool?", answer: "Test with 5-10 essays of varying quality. Compare AI scores against your own, and evaluate the detail and accuracy of the feedback." },
      { question: "Will AI writing scoring keep improving?", answer: "Absolutely. As LLM capabilities continue to advance and educational datasets grow, AI scoring accuracy is rapidly improving—expected to reach experienced teacher levels within 1-2 years." },
    ],
    cta: { text: "Try a Professional Essay Grading Tool", url: "https://example.com" },
  },
  {
    id: "demo-8",
    trend: DEMO_TRENDS[7],
    keyword: "AI agent automated essay grading",
    title: "AI Agent for Automated Essay Grading: Technical Architecture and Applications",
    metaDescription: "Deep dive into how AI Agents are applied in essay grading. Learn about the technical architecture, implementation, and real results of auto-grading intelligent agents.",
    slug: "ai-agent-automated-essay-grading",
    h1: "AI Agent Auto-Grading: Practical Applications of Educational AI Agents",
    content: `<h2>What Is an AI Agent?</h2>
<p>An <strong>AI Agent</strong> is an AI system capable of autonomous perception, decision-making, and task execution. In essay grading, an AI Agent doesn't just score—it automatically selects appropriate feedback strategies based on the score, and can even create personalized writing improvement plans.</p>
<p>Unlike simple "input essay → output score" systems, an AI Agent's grading is a multi-step intelligent process.</p>

<h2>How AI Agent Grading Works</h2>
<ul>
<li><strong>Perception Stage</strong>: Read the essay, identify genre, word count, and grade level</li>
<li><strong>Analysis Stage</strong>: Multi-dimensional analysis—grammar, logic, content, creativity</li>
<li><strong>Evaluation Stage</strong>: Score against rubrics, identify core issues</li>
<li><strong>Decision Stage</strong>: Select feedback strategy and detail level based on student proficiency</li>
<li><strong>Execution Stage</strong>: Generate detailed annotations, scoring reports, and improvement suggestions</li>
</ul>

<h2>The Future of AI Grading Agents</h2>
<p>As Agent technology matures, future AI grading agents will: track student writing progress over time, automatically recommend targeted writing exercises, and collaborate with teachers to optimize instructional strategies. AI Agents aren't just tools—they're teaching partners.</p>`,
    faq: [
      { question: "What's the difference between AI Agent grading and regular AI grading?", answer: "AI Agents have greater autonomy and adaptability. They can adjust grading strategies for different students and even remember historical performance to provide more targeted feedback." },
      { question: "Is AI Agent grading safe?", answer: "Modern AI Agents have strict safety boundary designs. In grading scenarios, the agent's behavior is confined to education-related tasks and cannot produce inappropriate content." },
      { question: "When will AI Agents fully replace manual grading?", answer: "In the near term, AI is best used as an assistive tool. Within 3-5 years, AI Agents are expected to reach the level of independently handling routine essay grading." },
    ],
    cta: { text: "Experience AI Agent Smart Grading", url: "https://example.com" },
  },
  {
    id: "demo-9",
    trend: DEMO_TRENDS[8],
    keyword: "AI knowledge base teaching question bank",
    title: "AI Knowledge Base + Essay Grading: Building a Smart Teaching Resource System",
    metaDescription: "Explore how AI knowledge base technology powers intelligent teaching resource management, combining with essay grading for smart question recommendations and student skill matching.",
    slug: "ai-knowledge-base-teaching-resources",
    h1: "AI Knowledge Base: The Intelligent Backend for Essay Grading",
    content: `<h2>Why Does Essay Grading Need a Knowledge Base?</h2>
<p>Excellent essay grading goes beyond error correction and scoring—it requires a <strong>knowledge base</strong>. A comprehensive collection of model essays, writing techniques, and scoring standards makes AI feedback more professional and targeted.</p>
<p>Imagine AI not only telling you "this argument is underdeveloped" but also retrieving 3 relevant passages from excellent model essays as references. That's the kind of feedback that truly adds value.</p>

<h2>AI Knowledge Base Applications in Grading</h2>
<ul>
<li><strong>Model Essay Retrieval</strong>: Automatically find relevant exemplary essays based on the student's topic and issues</li>
<li><strong>Scoring Standards Library</strong>: Built-in standardized test rubrics ensuring authoritative scoring</li>
<li><strong>Writing Techniques Library</strong>: Proven improvement methods for common writing issues</li>
<li><strong>Error Archive</strong>: Record typical student errors for targeted practice recommendations</li>
</ul>

<h2>Build Your Teaching Knowledge Base</h2>
<p>Modern AI knowledge base tools make it easy for teachers to build their own resource libraries. Upload model essays, rubrics, and teaching notes, and AI automatically organizes and indexes everything for smart reference during grading. It's like giving every teacher an experienced teaching assistant.</p>`,
    faq: [
      { question: "Do I need to build my own AI knowledge base?", answer: "Professional AI grading tools come with rich built-in knowledge bases. Teachers can also upload their own materials to customize the content." },
      { question: "Is the knowledge base content accurate and reliable?", answer: "Built-in content is reviewed by education experts. Teacher-uploaded content is quality-controlled by the teacher, with AI handling smart indexing without altering original content." },
      { question: "What file formats does the knowledge base support?", answer: "Supports Word, PDF, images, plain text, and other common formats. AI automatically parses and indexes uploaded content." },
    ],
    cta: { text: "Experience AI Knowledge Base Grading", url: "https://example.com" },
  },
  {
    id: "demo-10",
    trend: DEMO_TRENDS[9],
    keyword: "RAG education intelligent grading",
    title: "RAG Technology in Essay Grading: AI Feedback Grounded in Teaching Standards",
    metaDescription: "Understand how RAG (Retrieval-Augmented Generation) technology makes AI essay grading more professional by basing feedback on real teaching standards and model essays.",
    slug: "rag-education-intelligent-grading",
    h1: "RAG: The Secret Behind More Professional AI Essay Grading",
    content: `<h2>What Is RAG?</h2>
<p><strong>RAG (Retrieval-Augmented Generation)</strong> is a technology that enables AI to generate responses based on external knowledge. In essay grading, RAG ensures the AI doesn't grade from "memory" alone but references actual teaching standards, detailed rubrics, and exemplary model essays.</p>
<p>Think of it as having the AI consult a textbook while grading, rather than relying on gut feeling. The result is more accurate, authoritative, and standards-aligned feedback.</p>

<h2>How RAG Works in Grading</h2>
<ul>
<li><strong>Step 1</strong>: Receive the student essay and extract key features (genre, topic, grade level)</li>
<li><strong>Step 2</strong>: Retrieve relevant scoring standards and model essays from the knowledge base</li>
<li><strong>Step 3</strong>: Grade and score the essay using the retrieved reference materials</li>
<li><strong>Step 4</strong>: Generate professional feedback with cited references</li>
</ul>

<h2>Real-World Results</h2>
<p>Testing data shows that RAG-powered grading systems improved correlation with expert teacher scores from 0.82 to 0.93, with significantly enhanced professionalism and authority. Students reported: "The AI's comments are well-grounded, like grading from an experienced teacher."</p>
<p>Most importantly, RAG gives grading systems explainability—every piece of feedback can be traced back to a specific teaching standard, which is crucial for educational transparency.</p>`,
    faq: [
      { question: "What does RAG mean for regular users?", answer: "For teachers and students, RAG means more professional and accurate grading. You don't need to understand the technology—just know that every AI feedback point is backed by real teaching standards." },
      { question: "How is RAG grading different from regular AI grading?", answer: "Regular AI grades based on training data, which may be inaccurate or outdated. RAG grading references the latest teaching standards and model essays for more authoritative results." },
      { question: "Can I customize the RAG knowledge base?", answer: "Yes. Teachers can upload their school's scoring standards, past exemplary essays, and other materials. The RAG system automatically incorporates them into grading references." },
    ],
    cta: { text: "Experience RAG-Powered Smart Grading", url: "https://example.com" },
  },
];

// Simulated SSE event sequence (delay in ms)
export const DEMO_EVENTS: Array<{ delay: number; event: SSEEvent }> = [
  {
    delay: 0,
    event: {
      type: "parsing",
      data: {},
      message: "🧠 Analyzing your product...",
    },
  },
  {
    delay: 2000,
    event: {
      type: "parsed",
      data: { product: DEMO_PARSED_PRODUCT },
      message: `✅ Product analyzed: ${DEMO_PARSED_PRODUCT.productName} (${DEMO_PARSED_PRODUCT.category})`,
    },
  },
  {
    delay: 2500,
    event: {
      type: "selecting_trends",
      data: {},
      message: "🔥 Finding relevant trends...",
    },
  },
  {
    delay: 5500,
    event: {
      type: "trends_selected",
      data: { trends: DEMO_TRENDS },
      message: `✅ Found ${DEMO_TRENDS.length} relevant trends`,
    },
  },
  {
    delay: 6000,
    event: {
      type: "generating_keywords",
      data: {},
      message: "🔍 Generating SEO keywords...",
    },
  },
  {
    delay: 9000,
    event: {
      type: "keywords_generated",
      data: { keywordGroups: DEMO_KEYWORD_GROUPS },
      message: `✅ Generated ${DEMO_KEYWORD_GROUPS.length * 3} long-tail keywords`,
    },
  },
  // 10 pages, 1 second each
  ...DEMO_PAGES.map((page, index) => [
    {
      delay: 9500 + index * 1000,
      event: {
        type: "generating_page" as const,
        data: { index: index + 1 },
        message: `📝 Creating page ${index + 1}/10 (${page.trend.name})...`,
      },
    },
    {
      delay: 9500 + index * 1000 + 500,
      event: {
        type: "page_generated" as const,
        data: { page },
        message: `✅ Page ${index + 1} completed: ${page.keyword}`,
      },
    },
  ]).flat(),
  {
    delay: 20000,
    event: {
      type: "complete",
      data: {
        product: { description: DEMO_PRODUCT_DESCRIPTION, url: "https://example.com" },
        parsedProduct: DEMO_PARSED_PRODUCT,
        trends: DEMO_TRENDS,
        keywordGroups: DEMO_KEYWORD_GROUPS,
        pages: DEMO_PAGES,
      },
      message: "🎉 All 10 SEO pages generated!",
    },
  },
];

// Simulate demo generation flow
export function simulateDemo(
  onEvent: (event: SSEEvent) => void,
  onComplete: (pages: LandingPage[]) => void
): () => void {
  const timers: ReturnType<typeof setTimeout>[] = [];
  let cancelled = false;

  for (const { delay, event } of DEMO_EVENTS) {
    const timer = setTimeout(() => {
      if (cancelled) return;
      onEvent(event);
      if (event.type === "complete") {
        onComplete(DEMO_PAGES);
      }
    }, delay);
    timers.push(timer);
  }

  return () => {
    cancelled = true;
    timers.forEach(clearTimeout);
  };
}
