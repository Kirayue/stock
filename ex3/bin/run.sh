# Prepare data
node prepare-data.js 2016-08-01 2016-10-08 5 ../output/train-data
node prepare-data.js 2016-10-09 2016-10-21 5 ../output/test-data
# Build model
cd ../output
svm-scale -s train-data-scale-info train-data > train-data.scale
svm-train -b 1 -c 4 -g 0.0942809430816 train-data.scale model/train-model
cp model/train-model ../../output/train-model
cp train-data-scale-info ../../output/train-data-scale-info
# Test model
svm-scale -r train-data-scale-info test-data > test-data.scale
svm-predict -b 1 test-data.scale model/train-model test-result
