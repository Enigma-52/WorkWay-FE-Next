"use client";
const ProblemSection = () => {
  const platforms = ["LinkedIn", "Naukri", "YC Jobs", "4 ATS tabs", "a Google Sheet titled final_final_v7.xlsx"];
  
  const problems = [
    "apply to the same job twice",
    "forget where you applied",
    "rewrite the same intro",
    "lose track",
    "question your life choices",
  ];

  return (
    <section className="py-24 md:py-32">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-16 text-center">
            Be honest.{" "}
            <span className="text-muted-foreground">
              This is your current setup.
            </span>
          </h2>

          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            {/* You open */}
            <div className="space-y-6">
              <p className="text-muted-foreground font-mono text-sm uppercase tracking-wider">
                You open:
              </p>
              <div className="space-y-3">
                {platforms.map((platform, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card/50 hover:bg-card transition-colors"
                  >
                    <span className="w-2 h-2 rounded-full bg-destructive/60" />
                    <span className="font-mono text-sm">{platform}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* You: */}
            <div className="space-y-6">
              <p className="text-muted-foreground font-mono text-sm uppercase tracking-wider">
                You:
              </p>
              <div className="space-y-3">
                {problems.map((problem, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 rounded-lg border border-destructive/30 bg-destructive/5 hover:bg-destructive/10 transition-colors"
                  >
                    <span className="text-destructive">✗</span>
                    <span className="font-mono text-sm">{problem}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Punchline */}
          <div className="mt-16 text-center">
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              This is not "the grind".
              <br />
              <span className="text-foreground font-semibold">
                This is bad software.
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
