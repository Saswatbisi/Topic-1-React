import { simulateUseToggle, simulateUseLocalStorage, MockLocalStorage } from '../src/customHooks';
import { HooksAuditor } from '../src/hooksAuditor';

describe('React Custom Hooks Simulator & Rules Auditor Tests', () => {
  let auditor: HooksAuditor;

  beforeEach(() => {
    auditor = new HooksAuditor();
  });

  describe('Hooks Logic Simulators', () => {
    test('simulateUseToggle toggles values successfully', () => {
      const [value, toggle] = simulateUseToggle(false);
      expect(value()).toBe(false);

      expect(toggle()).toBe(true);
      expect(value()).toBe(true);

      expect(toggle()).toBe(false);
      expect(value()).toBe(false);
    });

    test('simulateUseLocalStorage gets and sets data correctly', () => {
      const storage = new MockLocalStorage();
      const [getValue, setValue] = simulateUseLocalStorage<string>('theme', 'light', storage);

      expect(getValue()).toBe('light');

      setValue('dark');
      expect(getValue()).toBe('dark');
      expect(storage.getItem('theme')).toBe(JSON.stringify('dark'));
    });
  });

  describe('Hooks Auditor Naming Conventions Checks', () => {
    test('should pass validation on compliant hook names', () => {
      const report1 = auditor.auditHookNaming('useToggle');
      const report2 = auditor.auditHookNaming('useLocalStorage');

      expect(report1.valid).toBe(true);
      expect(report2.valid).toBe(true);
    });

    test('should flag hook names missing use prefix', () => {
      const report = auditor.auditHookNaming('toggleHook');

      expect(report.valid).toBe(false);
      expect(report.violations[0]).toContain("must start with the prefix 'use'");
    });

    test('should flag hook names missing camelCase formatting', () => {
      const report1 = auditor.auditHookNaming('usetoggle');
      const report2 = auditor.auditHookNaming('use_toggle');

      expect(report1.valid).toBe(false);
      expect(report1.violations[0]).toContain("must follow camelCase conventions");

      expect(report2.valid).toBe(false);
      expect(report2.violations[0]).toContain("must follow camelCase conventions");
    });
  });

  describe('Hooks Auditor Callback Dependency Checks', () => {
    test('should flag lifecycle hooks missing dependency arrays', () => {
      const code = `
        const hook = () => {
          useEffect(() => {
            console.log("effect");
          })
        }
      `;
      const report = auditor.auditHookDependencies(code);

      expect(report.valid).toBe(false);
      expect(report.violations[0]).toContain("should specify a dependency array");
    });
  });
});
