
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Star, ThumbsUp, Users } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

interface CustomerSatisfactionProps {
  selectedBank: string;
}

const satisfactionData = {
  'SBIN.NS': {
    overallRating: 4.1,
    mobileAppRating: 4.3,
    recommendationRate: 82,
    nps: 68,
  },
  'AXISBANK.NS': {
    overallRating: 4.2,
    mobileAppRating: 4.5,
    recommendationRate: 84,
    nps: 72,
  },
  'HDFCBANK.NS': {
    overallRating: 4.4,
    mobileAppRating: 4.6,
    recommendationRate: 88,
    nps: 76,
  },
  'KOTAKBANK.NS': {
    overallRating: 4.3,
    mobileAppRating: 4.7,
    recommendationRate: 86,
    nps: 75,
  },
  'ICICIBANK.NS': {
    overallRating: 4.2,
    mobileAppRating: 4.4,
    recommendationRate: 83,
    nps: 70,
  }
};

const CustomerSatisfaction = ({ selectedBank }: CustomerSatisfactionProps) => {
  const data = satisfactionData[selectedBank];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          Customer Satisfaction
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <div className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-500" />
                  Overall Rating
                </div>
                <div className="text-sm font-semibold">{data.overallRating} / 5</div>
              </div>
              <Progress value={data.overallRating * 20} className="h-2 bg-gray-200" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <div className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-500" />
                  Mobile App Rating
                </div>
                <div className="text-sm font-semibold">{data.mobileAppRating} / 5</div>
              </div>
              <Progress value={data.mobileAppRating * 20} className="h-2 bg-gray-200" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <div className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4 text-green-500" />
                  Recommendation Rate
                </div>
                <div className="text-sm font-semibold">{data.recommendationRate}%</div>
              </div>
              <Progress value={data.recommendationRate} className="h-2 bg-gray-200" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <div className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <Users className="h-4 w-4 text-blue-500" />
                  Net Promoter Score
                </div>
                <div className="text-sm font-semibold">{data.nps}</div>
              </div>
              <Progress value={data.nps} className="h-2 bg-gray-200" />
            </div>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-1">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star
                    key={starIndex}
                    className={`h-3 w-3 ${starIndex < 5-index ? 'text-amber-500' : 'text-gray-300'}`}
                    fill={starIndex < 5-index ? '#F59E0B' : '#D1D5DB'}
                  />
                ))}
              </div>
              <div className="text-xs text-gray-500">{Math.round(25 - index * 5)}%</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerSatisfaction;
