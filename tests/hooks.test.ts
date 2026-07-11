import { simulateUseToggle, simulateUseLocalStorage, MockLocalStorage } from '../src/customHooks';
import { HooksAuditor } from '../src/hooksAuditor';

describe('React Custom Hooks Simulator & Rules Auditor Tests', () => {
  let auditor: HooksAuditor;

  beforeEach(() => {
    auditor = new HooksAuditor();
  });

  describe('Hooks Logic Simulators', () => {
    test('simulateUseToggle toggles values successfully', () => {
      // Test Case 1: useToggle state toggling checks
      const [value, toggle] = simulateUseToggle(false);
      expect(value()).toBe(false);

      expect(toggle()).toBe(true);
      expect(value()).toBe(true);

      expect(toggle()).toBe(false);
      expect(value()).toBe(false);
    });

    test('simulateUseLocalStorage gets and sets data correctly', () => {
      // Test Case 2: useLocalStorage state persistence checks
      // 1. Instantiate the local storage engine with key `theme` set to `light`.
      const storage = new MockLocalStorage();
      storage.setItem('theme', JSON.stringify('light'));

      // 2. Invoke `simulateUseLocalStorage` to get and set the value.
      const [getValue, setValue] = simulateUseLocalStorage<string>('theme', 'default', storage);

      // Expected Result: The initial query returns `light`.
      expect(getValue()).toBe('light');

      // 3. Call `setValue('dark')`.
      setValue('dark');

      // Expected Result: The final query returns `dark`.
      expect(getValue()).toBe('dark');
      // Expected Result: The mock storage contains the JSON-serialized string `"dark"`.
      expect(storage.getItem('theme')).toBe(JSON.stringify('dark'));
    });
  });

  describe('Hooks Auditor Naming Conventions Checks', () => {
    test('should pass validation on compliant hook names', () => {
      // Test Case 3: Compliant hook naming conventions checks
      const compliantNames = ['useToggle', 'useLocalStorage', 'useMediaQuery'];
      for (const name of compliantNames) {
        const report = auditor.auditHookNaming(name);
        expect(report.valid).toBe(true);
        expect(report.violations).toHaveLength(0);
      }
    });

    test('should flag hook names missing use prefix', () => {
      // Test Case 4: Hook naming checks missing use prefix
      const report = auditor.auditHookNaming('toggleHook');

      expect(report.valid).toBe(false);
      expect(report.violations[0]).toContain("must start with the prefix 'use'");
    });

    test('should flag hook names missing camelCase formatting', () => {
      // Test Case 5: Hook naming checks missing camelCase format
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
      // Test Case 6: Hook dependency validations checks
      const code = `
        const hook = () => {
          useEffect(() => {
            console.log("effect");
          })
        }
      `;
      const report = auditor.auditHookDependencies(code);

      expect(report.valid).toBe(false);
      expect(report.violations[0]).toContain("should specify a dependency array to prevent infinite rendering cycles");
    });
  });
});
