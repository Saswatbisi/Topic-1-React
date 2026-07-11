import { MonorepoAuditor } from '../src/monorepoAuditor';

describe('Orion LMS Monorepo Architecture Auditor Tests', () => {
  let auditor: MonorepoAuditor;

  beforeEach(() => {
    auditor = new MonorepoAuditor();
  });

  describe('pnpm workspaces paths checks', () => {
    test('should pass validation on compliant workspace paths mapping', () => {
      const content = `
        packages:
          - 'apps/*'
          - 'packages/*'
      `;
      const report = auditor.auditWorkspaceYaml(content);

      expect(report.valid).toBe(true);
      expect(report.violations).toHaveLength(0);
    });

    test('should flag configurations missing apps folders mappings', () => {
      const content = `
        packages:
          - 'packages/*'
      `;
      const report = auditor.auditWorkspaceYaml(content);

      expect(report.valid).toBe(false);
      expect(report.violations[0]).toContain("must include 'apps/*'");
    });

    test('should flag configurations missing packages folders mappings', () => {
      const content = `
        packages:
          - 'apps/*'
      `;
      const report = auditor.auditWorkspaceYaml(content);

      expect(report.valid).toBe(false);
      expect(report.violations[0]).toContain("must include 'packages/*'");
    });
  });

  describe('Turborepo turbo.json pipeline checks', () => {
    test('should pass verification on valid task definitions and caches', () => {
      const content = JSON.stringify({
        pipeline: {
          build: {
            dependsOn: ["^build"],
            outputs: [".next/**"]
          },
          test: {
            dependsOn: ["build"]
          }
        }
      });
      const report = auditor.auditTurboJson(content);

      expect(report.valid).toBe(true);
      expect(report.violations).toHaveLength(0);
    });

    test('should flag turbo configs missing build pipelines', () => {
      const content = JSON.stringify({
        pipeline: {
          test: {}
        }
      }); // Missing build
      const report = auditor.auditTurboJson(content);

      expect(report.valid).toBe(false);
      expect(report.violations[0]).toContain("must define a 'build' task pipeline");
    });

    test('should warn on build pipelines lacking outputs specifications', () => {
      const content = JSON.stringify({
        pipeline: {
          build: {
            dependsOn: []
          },
          test: {}
        }
      }); // build lacks outputs
      const report = auditor.auditTurboJson(content);

      expect(report.valid).toBe(false);
      expect(report.violations[0]).toContain("build pipeline should cache build outputs");
    });
  });

  describe('Global package.json validations', () => {
    test('should pass on package files delegating dev scripts to turbo', () => {
      const content = JSON.stringify({
        scripts: {
          dev: "turbo run dev",
          build: "turbo run build"
        }
      });
      const report = auditor.auditGlobalPackageJson(content);

      expect(report.valid).toBe(true);
      expect(report.violations).toHaveLength(0);
    });

    test('should warn on global manifests missing turbo runner commands', () => {
      const content = JSON.stringify({
        scripts: {
          dev: "next dev",
          build: "next build"
        }
      }); // Does not delegate to turbo globally
      const report = auditor.auditGlobalPackageJson(content);

      expect(report.valid).toBe(false);
      expect(report.violations[0]).toContain("Global 'dev' script should delegate running tasks to Turborepo");
    });
  });
});
