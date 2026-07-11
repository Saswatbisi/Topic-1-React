// Advanced CI/CD Pipeline Configuration Auditor

export interface AuditReport {
  valid: boolean;
  violations: string[];
}

export class PipelineAuditor {
  // 1. Audit Jenkinsfile for declarative structure compliance
  auditJenkinsfile(content: string): AuditReport {
    const violations: string[] = [];

    if (!content.includes('pipeline {')) {
      violations.push("Syntax Error: Jenkinsfile must start with declarative 'pipeline {' block.");
    }
    if (!content.includes('agent ')) {
      violations.push("Configuration Error: Jenkinsfile must declare a global 'agent' executor.");
    }
    if (!content.includes('stages {')) {
      violations.push("Structure Error: Jenkinsfile must contain a 'stages' block.");
    }
    if (!content.includes('cleanWs()') && !content.includes('deleteDir()')) {
      violations.push("Best Practice Alert: Jenkinsfile post-execution should clean workspaces to save agent space.");
    }

    return {
      valid: violations.length === 0,
      violations
    };
  }

  // 2. Audit GitHub Actions workflow configuration files for security and testing setups
  auditGitHubActions(content: string): AuditReport {
    const violations: string[] = [];

    // Check OIDC permissions
    if (content.includes('aws-actions/configure-aws-credentials')) {
      if (!content.includes('id-token: write')) {
        violations.push("Security Violation: AWS credentials configuration requires 'id-token: write' permissions block.");
      }
      if (!content.includes('role-to-assume:')) {
        violations.push("Security Alert: AWS deployment jobs should assume OIDC roles instead of utilizing hardcoded keys.");
      }
    }

    // Check multi-environment matrix testing configurations
    if (!content.includes('matrix:')) {
      violations.push("Best Practice Violation: Pipeline should run matrix testing to validate across multiple runner engines.");
    }

    return {
      valid: violations.length === 0,
      violations
    };
  }
}
