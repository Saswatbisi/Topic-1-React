// Orion LMS pnpm + Turborepo Monorepo Setup Auditor

export interface AuditReport {
  valid: boolean;
  violations: string[];
}

export class MonorepoAuditor {
  // 1. Audit pnpm-workspace.yaml for projects paths mappings
  auditWorkspaceYaml(content: string): AuditReport {
    const violations: string[] = [];

    if (!content.includes("- 'apps/*'")) {
      violations.push("Configuration Error: pnpm-workspace.yaml must include 'apps/*' in the packages list.");
    }
    if (!content.includes("- 'packages/*'")) {
      violations.push("Configuration Error: pnpm-workspace.yaml must include 'packages/*' in the packages list.");
    }

    return {
      valid: violations.length === 0,
      violations
    };
  }

  // 2. Audit turbo.json for task pipelines definitions
  auditTurboJson(content: string): AuditReport {
    const violations: string[] = [];

    try {
      const config = JSON.parse(content);
      const pipeline = config.pipeline || {};

      if (!pipeline.build) {
        violations.push("Configuration Error: turbo.json must define a 'build' task pipeline.");
      } else {
        const buildOutputs = pipeline.build.outputs || [];
        if (!buildOutputs.includes(".next/**") && !buildOutputs.includes("dist/**")) {
          violations.push("Optimization Warning: turbo.json build pipeline should cache build outputs (e.g. '.next/**' or 'dist/**').");
        }
      }

      if (!pipeline.test) {
        violations.push("Configuration Error: turbo.json must define a 'test' task pipeline.");
      }

    } catch {
      violations.push("Syntax Error: turbo.json must be a valid JSON string.");
    }

    return {
      valid: violations.length === 0,
      violations
    };
  }

  // 3. Audit global package.json runner integrations
  auditGlobalPackageJson(content: string): AuditReport {
    const violations: string[] = [];

    try {
      const manifest = JSON.parse(content);
      const scripts = manifest.scripts || {};

      if (!scripts.dev || !scripts.dev.includes("turbo")) {
        violations.push("Best Practice Violation: Global 'dev' script should delegate running tasks to Turborepo ('turbo run dev').");
      }
      if (!scripts.build || !scripts.build.includes("turbo") && !scripts.build.includes("tsc")) {
        violations.push("Best Practice Violation: Global 'build' script should use Turborepo or tsc compilation.");
      }

    } catch {
      violations.push("Syntax Error: package.json must be a valid JSON string.");
    }

    return {
      valid: violations.length === 0,
      violations
    };
  }
}
