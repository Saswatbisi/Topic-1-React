// React Custom Hooks Configurations & Rules Auditor

export interface AuditReport {
  valid: boolean;
  violations: string[];
}

export class HooksAuditor {
  // 1. Audit custom React hook naming conventions
  auditHookNaming(hookName: string): AuditReport {
    const violations: string[] = [];

    if (!hookName.startsWith("use")) {
      violations.push(`Naming Error: React custom hook '${hookName}' must start with the prefix 'use'.`);
      return { valid: false, violations };
    }

    if (hookName === "use") {
      violations.push("Naming Error: Hook name cannot be just 'use'. It must be followed by a camelCase word.");
      return { valid: false, violations };
    }

    const firstCharAfterUse = hookName.charAt(3);
    if (!/[A-Z]/.test(firstCharAfterUse)) {
      violations.push(`Naming Error: React custom hook name '${hookName}' must follow camelCase conventions (e.g., 'useToggle', not 'usetoggle' or 'use_toggle').`);
    }

    return {
      valid: violations.length === 0,
      violations
    };
  }

  // 2. Audit hook callback dependencies array definition
  auditHookDependencies(code: string): AuditReport {
    const violations: string[] = [];

    // Check if standard hooks are invoked without dependency arrays (leads to infinite renders)
    const emptyDepsMatches = code.match(/(useEffect|useMemo|useCallback)\(\s*\(\)\s*=>\s*\{[^}]*\}\s*\)/g);
    if (emptyDepsMatches) {
      violations.push("Best Practice Violation: React lifecycle hooks (useEffect/useMemo/useCallback) should specify a dependency array to prevent infinite rendering cycles.");
    }

    return {
      valid: violations.length === 0,
      violations
    };
  }
}
