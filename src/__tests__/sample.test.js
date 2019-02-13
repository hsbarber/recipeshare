describe('sample test', () => {
  it('it works as expected', () => {
    const age = 100;
    expect(age).toEqual(100);
  });
  it('handles ranges just fine', () => {
    const age = 200;
    expect(age).toBeGreaterThan(100);
  });
});
