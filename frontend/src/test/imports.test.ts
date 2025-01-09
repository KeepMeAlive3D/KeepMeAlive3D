import {describe, it, expect} from 'vitest';

const modules = import.meta.glob('../*/*.tsx', {eager: true});

describe('Folder Import Test', () => {
    for (const [path, module] of Object.entries(modules)) {
        it(`should import ${path} without errors`, () => {
            expect(module).toBeDefined();
        });
    }
});