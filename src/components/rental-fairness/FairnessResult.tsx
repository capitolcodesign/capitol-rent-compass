
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EvaluationResult } from "@/types/rental-fairness";
import {
  CircularProgressbarWithChildren,
  buildStyles
} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface FairnessResultProps {
  result: EvaluationResult | null;
  isLoading: boolean;
}

const getScoreColor = (score: number): string => {
  if (score >= 85) return '#4ade80'; // green-400
  if (score >= 70) return '#a3e635'; // lime-400
  if (score >= 50) return '#facc15'; // yellow-400
  if (score >= 30) return '#fb923c'; // orange-400
  return '#ef4444'; // red-500
};

const FairnessResult: React.FC<FairnessResultProps> = ({ result, isLoading }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Analyzing Rental Fairness...</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]"></div>
          </div>
          <p className="text-center mt-6 text-muted-foreground">
            Our AI is evaluating your property based on the provided details and metrics.
            This may take a moment.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!result) return null;

  const scoreColor = getScoreColor(result.fairnessScore);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Rental Fairness Analysis</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center">
            <div style={{ width: 150, height: 150 }}>
              <CircularProgressbarWithChildren
                value={result.fairnessScore}
                styles={buildStyles({
                  rotation: 0,
                  strokeLinecap: 'round',
                  textSize: '16px',
                  pathTransitionDuration: 0.5,
                  pathColor: scoreColor,
                  trailColor: '#e5e7eb',
                })}
              >
                <div className="text-center">
                  <strong className="text-3xl">{result.fairnessScore}</strong>
                  <p className="text-sm text-muted-foreground">Fairness Score</p>
                </div>
              </CircularProgressbarWithChildren>
            </div>
            <div className="mt-6 text-center">
              <p className="font-medium">Fair Price Range:</p>
              <p className="text-lg">
                ${result.fairPriceRange.min} - ${result.fairPriceRange.max}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Based on your metrics and market data
              </p>
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <div>
              <h3 className="font-medium text-lg mb-2">Analysis</h3>
              <div className="text-sm space-y-2">
                {result.analysis.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-lg mb-2">Recommendations</h3>
              <div className="text-sm space-y-2">
                {result.recommendations.split('\n').map((rec, index) => (
                  <p key={index}>{rec}</p>
                ))}
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Summary</h3>
              <p className="text-sm">{result.summary}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FairnessResult;
