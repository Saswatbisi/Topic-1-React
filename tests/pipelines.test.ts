import { PipelineAuditor } from '../src/pipelineAuditor';

describe('Advanced CI/CD Pipeline Auditor Simulation Tests', () => {
  let auditor: PipelineAuditor;

  beforeEach(() => {
    auditor = new PipelineAuditor();
  });

  describe('Jenkinsfile Declarative Audit checks', () => {
    test('should pass verification on valid declarative Jenkinsfiles', () => {
      const content = `
        pipeline {
          agent any
          stages {
            stage('Build') {
              steps { sh 'echo build' }
            }
          }
          post {
            always { cleanWs() }
          }
        }
      `;
      const report = auditor.auditJenkinsfile(content);

      expect(report.valid).toBe(true);
      expect(report.violations).toHaveLength(0);
    });

    test('should flag missing structural declarative blocks', () => {
      const content = `
        node {
          stage('Build') {
            sh 'echo build'
          }
        }
      `; // Scripted style, missing 'pipeline {' and 'stages {'
      const report = auditor.auditJenkinsfile(content);

      expect(report.valid).toBe(false);
      expect(report.violations[0]).toContain('must start with declarative');
    });

    test('should warn when workspaces are not cleaned post-execution', () => {
      const content = `
        pipeline {
          agent any
          stages {
            stage('Build') {
              steps { sh 'echo build' }
            }
          }
        }
      `; // Missing cleanWs()
      const report = auditor.auditJenkinsfile(content);

      expect(report.valid).toBe(false);
      expect(report.violations[0]).toContain('should clean workspaces');
    });
  });

  describe('GitHub Actions Workflow Audit checks', () => {
    test('should pass verification on compliant OIDC matrix workflows', () => {
      const content = `
        name: Deployment
        jobs:
          build:
            strategy:
              matrix:
                node: [18, 20]
            permissions:
              id-token: write
            steps:
              - uses: aws-actions/configure-aws-credentials@v2
                with:
                  role-to-assume: arn:aws:iam::1234:role/oidc
      `;
      const report = auditor.auditGitHubActions(content);

      expect(report.valid).toBe(true);
      expect(report.violations).toHaveLength(0);
    });

    test('should flag missing OIDC permissions when configure-aws-credentials is used', () => {
      const content = `
        name: Deployment
        jobs:
          build:
            strategy:
              matrix:
                node: [18]
            steps:
              - uses: aws-actions/configure-aws-credentials@v2
                with:
                  role-to-assume: arn:aws:iam::1234:role/oidc
      `; // Missing 'id-token: write' permissions
      const report = auditor.auditGitHubActions(content);

      expect(report.valid).toBe(false);
      expect(report.violations[0]).toContain("requires 'id-token: write'");
    });

    test('should warn on workflows missing test runner matrix strategies', () => {
      const content = `
        name: Deployment
        jobs:
          build:
            steps:
              - run: npm test
      `; // Missing matrix: block
      const report = auditor.auditGitHubActions(content);

      expect(report.valid).toBe(false);
      expect(report.violations[0]).toContain('should run matrix testing');
    });
  });
});
