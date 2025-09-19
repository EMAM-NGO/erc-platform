import { useMemo } from 'react';
import { useTypingEffect } from '../hooks/useTypingEffect';

const snippets = [
  {
    language: 'Python // Pandas',
    code: `import pandas as pd\ndf = pd.read_csv('data.csv')\nprint(df.head())`,
  },
  {
    language: 'Python // NumPy',
    code: `import numpy as np\narr = np.array([[1, 2, 3], [4, 5, 6]])\nprint(arr.shape)`,
  },
  {
    language: 'Python // Scikit-learn',
    code: `from sklearn.ensemble import RandomForestClassifier\nmodel = RandomForestClassifier(n_estimators=100)\nmodel.fit(X_train, y_train)`,
  },
  {
    language: 'Python // Matplotlib',
    code: `import matplotlib.pyplot as plt\nplt.scatter(df['feature1'], df['feature2'])\nplt.title('Feature Correlation')\nplt.show()`,
  },
  {
    language: 'SQL',
    code: `SELECT category, AVG(sales)\nFROM transactions\nGROUP BY category\nORDER BY AVG(sales) DESC;`,
  },
  {
    language: 'Python // TensorFlow/Keras',
    code: `import tensorflow as tf\nmodel = tf.keras.Sequential([\n  tf.keras.layers.Dense(128, activation='relu'),\n  tf.keras.layers.Dense(10, activation='softmax')\n])`,
  },
  {
    language: 'Python // Pandas GroupBy',
    code: `grouped_data = df.groupby('category')['value'].sum()\nprint(grouped_data)`,
  },
  {
    language: 'Python // Plotly Express',
    code: `import plotly.express as px\nfig = px.histogram(df, x='age')\nfig.show()`,
  },
  {
    language: 'Python // Data Cleaning',
    code: `missing_values = df.isnull().sum()\nprint(missing_values)`,
  },
];

const DataScienceSnippet = () => {
  const randomSnippet = useMemo(() => snippets[Math.floor(Math.random() * snippets.length)], []);
  const typedCode = useTypingEffect(randomSnippet.code);

  return (
    <div className="w-full max-w-lg p-4 rounded-lg bg-gray-900/70 backdrop-blur-sm shadow-2xl font-mono text-sm border border-gray-500/30">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <span className="text-gray-400">{randomSnippet.language}</span>
      </div>
      <pre className="text-sky-300 whitespace-pre-wrap">
        <code>{typedCode}</code>
        <span className="animate-blink">_</span>
      </pre>
    </div>
  );
};

export default DataScienceSnippet;