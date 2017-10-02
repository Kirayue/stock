# Generate the predicting data
node generate-predict-data.js $1 5 ../output/predict-data ../output/predict-stock-list

# Predict
svm-scale -r model/train-data-scale-info ../output/predict-data > ../output/predict-data.scale
svm-predict -b 1 ../output/predict-data.scale model/train-model ../output/predict-result

# Make decision
node make-decision.js ../output/predict-result ../output/predict-stock-list ../commit/$1_$1.json


