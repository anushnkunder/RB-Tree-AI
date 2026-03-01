class LinearRegression {
  constructor() {
    this.slope = 0;
    this.intercept = 0;
    this.rSquared = 0;
  }

  // Fit the regression model
  fit(xValues, yValues) {
    if (xValues.length !== yValues.length || xValues.length === 0) {
      throw new Error('Invalid input arrays');
    }

    const n = xValues.length;

    // Calculate means
    const xMean = xValues.reduce((a, b) => a + b, 0) / n;
    const yMean = yValues.reduce((a, b) => a + b, 0) / n;

    // Calculate slope: Σ((x - x̄)(y - ȳ)) / Σ((x - x̄)²)
    let numerator = 0;
    let denominator = 0;

    for (let i = 0; i < n; i++) {
      const xDiff = xValues[i] - xMean;
      const yDiff = yValues[i] - yMean;
      numerator += xDiff * yDiff;
      denominator += xDiff * xDiff;
    }

    this.slope = denominator !== 0 ? numerator / denominator : 0;
    this.intercept = yMean - this.slope * xMean;

    // Calculate R²
    this.rSquared = this.computeRSquared(xValues, yValues);

    return {
      slope: this.slope,
      intercept: this.intercept,
      rSquared: this.rSquared
    };
  }

  // Predict y value for given x
  predict(x) {
    return this.slope * x + this.intercept;
  }

  // Compute R² (coefficient of determination)
  computeRSquared(xValues, yValues) {
    const yMean = yValues.reduce((a, b) => a + b, 0) / yValues.length;

    let ssTotal = 0; // Total sum of squares
    let ssResidual = 0; // Residual sum of squares

    for (let i = 0; i < xValues.length; i++) {
      const predicted = this.predict(xValues[i]);
      ssTotal += Math.pow(yValues[i] - yMean, 2);
      ssResidual += Math.pow(yValues[i] - predicted, 2);
    }

    return ssTotal !== 0 ? 1 - (ssResidual / ssTotal) : 0;
  }

  // Get regression equation as string
  getEquation() {
    const sign = this.intercept >= 0 ? '+' : '';
    return `y = ${this.slope.toFixed(4)}x ${sign} ${this.intercept.toFixed(4)}`;
  }
}

module.exports = LinearRegression;
