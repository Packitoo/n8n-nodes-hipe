import { Hipe, EMBEDDED_RESOURCES } from './Hipe.node';

describe('Hipe.buildProperties', () => {
	it('should throw an error if a resource returns invalid properties', () => {
		// Mock embeddedResources with one valid and one invalid
		const validResource = {
			buildProperties: () => ['valid', []],
		};
		const invalidResource = {
			buildProperties: () => ['invalid', undefined],
		};
		const hipe = new Hipe();
		// Patch Logger.error to silence expected error logs
		const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
		expect(() => {
			hipe.buildProperties([validResource, invalidResource]);
		}).toThrowError('Resource "invalid" did not return a valid properties array!');
		errorSpy.mockRestore();
	});

	it('should not throw if all resources return valid arrays', () => {
		const validResource1 = {
			buildProperties: () => ['one', []],
		};
		const validResource2 = {
			buildProperties: () => [
				'two',
				[{ displayName: 'Test', name: 'test', type: 'string', default: '' }],
			],
		};
		const hipe = new Hipe();
		expect(() => {
			hipe.buildProperties([validResource1, validResource2]);
		}).not.toThrow();
	});
});

describe('Static: All node resource properties of type collection must have options', () => {
	it('should ensure all collection type properties in all actions have options defined', () => {
		// Get all embedded resources
		if (!EMBEDDED_RESOURCES) throw new Error('Could not access EMBEDDED_RESOURCES');
		const badProps: string[] = [];
		for (const resource of EMBEDDED_RESOURCES) {
			if (typeof resource.buildProperties !== 'function') continue;
			const [resourceName, properties] = resource.buildProperties();
			for (const prop of properties) {
				// Only check if prop is an object and has a type property
				if (
					typeof prop === 'object' &&
					prop !== null &&
					'type' in prop &&
					(prop as any).type === 'collection' &&
					!('options' in prop)
				) {
					badProps.push(`${resourceName}.${(prop as any).name}`);
				}
			}
		}
		if (badProps.length > 0) {
			throw new Error(
				`The following properties of type 'collection' are missing 'options':\n${badProps.join('\n')}`,
			);
		}
	});
});
