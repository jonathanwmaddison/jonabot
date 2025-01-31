export interface Weakness {
  title: string;
  shortDescription: string;
  context: string;
  example: string;
  learningOutcome: string;
  currentApproach: string;
}

export const weaknessData: Weakness[] = [
  {
    title: "Architectural Change Management",
    shortDescription: "Building consensus and driving adoption for architectural changes",
    context: "Experience with implementing microfrontends and introducing new technologies like React Query",
    example: "When introducing React Query, initially focused too much on technical demonstration in a small environment rather than building broader organizational consensus. While the technical implementation was successful, the 'lone wolf' approach limited potential organizational impact.",
    learningOutcome: "Recognized that technical excellence alone isn't sufficient for organizational change. Success requires early stakeholder involvement, collaborative discussion, and established standards.",
    currentApproach: "Now create technical RFCs, schedule architecture review sessions, and establish working groups to develop shared standards before implementation. Focus on building coalitions early and creating spaces for collaborative technical discussion."
  },
  {
    title: "Technical Leadership Transition",
    shortDescription: "Adapting from individual contributor to technical leader role",
    context: "Career progression from Software Engineer to Staff Frontend Engineer at Paige",
    example: "Initially approached team technical challenges by diving deep into implementation details personally, rather than effectively delegating and empowering team members.",
    learningOutcome: "Learned that effective technical leadership requires balancing hands-on work with enabling team success and growth.",
    currentApproach: "Focus on mentoring, architectural guidance, and creating technical decision-making frameworks that empower team members while maintaining technical excellence."
  },
  {
    title: "Innovation vs. Stability Balance",
    shortDescription: "Managing excitement for new technologies with business stability needs",
    context: "Experience in regulated medical environments at Paige and banking at Grasshopper Bank",
    example: "Enthusiasm for implementing cutting-edge AI technologies sometimes needed to be balanced against regulatory compliance and system stability requirements.",
    learningOutcome: "Developed better awareness of how to evaluate new technologies in the context of business constraints and compliance requirements.",
    currentApproach: "Created structured evaluation processes for new technologies that consider both innovation potential and stability requirements, especially in regulated environments."
  },
  {
    title: "Documentation and Knowledge Transfer",
    shortDescription: "Balancing feature development with comprehensive documentation",
    context: "Work with complex systems including microfrontends, AI integration, and medical systems",
    example: "Initially focused more on building and shipping features, sometimes leaving documentation as an afterthought.",
    learningOutcome: "Recognized the crucial importance of documentation for team scalability and system maintenance.",
    currentApproach: "Integrate documentation into the development process, including architectural decision records, system design documents, and clear handoff procedures."
  },
  {
    title: "Project Scope Management",
    shortDescription: "Managing perfectionist tendencies in technical implementation",
    context: "Complex AI-integrated projects and system architecture work",
    example: "Tendency to want to perfect every aspect of a system sometimes led to scope creep or delayed releases.",
    learningOutcome: "Learned to better prioritize features and make pragmatic decisions about what to include in initial releases.",
    currentApproach: "Implement iterative development approaches with clear MVP definitions and phased feature rollouts based on user feedback and business priorities."
  }
]; 