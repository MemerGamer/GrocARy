import React from 'react';
import { ProductARScene } from '../ProductARScene';
import renderer from 'react-test-renderer';
import { it, expect } from '@jest/globals';

const mockProduct = {
    id: '123',
    ean: '123456789',
    fullName: 'Test Product',
    brand: 'Test Brand',
    quantity: '500g',
    imageUrl: 'https://example.com/image.jpg',
    nutriScore: 'a' as const,
    allergens: ['milk', 'nuts'],
    ingredientsText: 'Ingredient 1, Ingredient 2',
    nutrientLevels: {},
    scannedAt: new Date('2023-01-01T00:00:00.000Z'),
};

it('renders correctly', () => {
    renderer.create(<ProductARScene product={mockProduct} />);
});

it('renders "Scanning..." when no product is provided', () => {
    const tree = renderer.create(<ProductARScene product={null} />);
    const json = tree.toJSON();
    expect(JSON.stringify(json)).toContain('Scanning...');
});

it('renders product details when product is provided', () => {
    const tree = renderer.create(<ProductARScene product={mockProduct} />);
    const json = tree.toJSON();
    // Check for brand
    expect(JSON.stringify(json)).toContain('TEST BRAND'); // Brand is uppercased in component
    // Check for product name
    expect(JSON.stringify(json)).toContain('Test Product');
    // Check for quantity
    expect(JSON.stringify(json)).toContain('500g');
});
