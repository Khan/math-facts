# math-facts
Learn basic math facts

## Getting Started

1. Install dependencies: `npm install`
2. Build iOS/main.jsbundle: `curl http://localhost:8081/index.ios.bundle\?dev\=0 -o iOS/main.jsbundle`
3. Open MathFacts.xcodeproj
4. Build and run app
5. Learn basic math facts ^_^

## To deploy via code push
```
react-native bundle
code-push release MathFacts ./ios/main.jsbundle 1.0.0
```
