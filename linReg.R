# Set working directory
setwd("D:/doktorat/text mining/textMining")
######################################################

library('rjson')
library('dplyr')
library('lattice')

# Give the input file name to the function, has to be proper json format
resultJson <- fromJSON(file = "tsStoreDataR.json")

# Print the result.


result<- bind_rows(resultJson, .id = 'Time')
result <- result[,-1]

datesR <- data.frame(Date=as.Date(character()))

for(i in (1: length(result$Time))){
timestamp <- strptime(result[i,1], tz = "UTC", "%Y-%m-%dT%H:%M:%OS")
datesR[i,1] <- as.Date(timestamp, "%Y-%m-%d")
}

result[,1] <- datesR[,1]
print(result[1,1])

# Ploting the results 
p1 = xyplot(result$abortionCount~result$Time,  
            type = c("p","r"), col.line = "red", lwd = 2, 
            xlab = "Date", ylab = "Count", main = list(label="Count for Concept 'Abortion'", cex=0.85), grid=TRUE)
p2 = xyplot(result$gayCount~result$Time,       
            type = c("p","r"), col.line = "red", lwd = 2, 
            xlab = "Date", ylab = "Count", main = list(label="Count for Concept 'Gay'", cex=0.85), grid=TRUE)
p3 = xyplot(result$privacyCount~result$Time,   
            type = c("p","r"), col.line = "red", lwd = 2, 
            xlab = "Date", ylab = "Count", main = list(label="Count for Concept 'Privacy'", cex=0.85), grid=TRUE)
p4 = xyplot(result$mexicoCount~result$Time,    
            type = c("p","r"), col.line = "red", lwd = 2, 
            xlab = "Date", ylab = "Count", main = list(label="Count for Concept 'Mexico'", cex=0.85), grid=TRUE)
p5 = xyplot(result$wallCount~result$Time,      
            type = c("p","r"), col.line = "red", lwd = 2, 
            xlab = "Date", ylab = "Count", main = list(label="Count for Concept 'Illegal immigration'", cex=0.85), grid=TRUE)
p6 = xyplot(result$wallStCount~result$Time,    
            type = c("p","r"), col.line = "red", lwd = 2, 
            xlab = "Date", ylab = "Count", main = list(label="Count for Concept 'Wall Street'", cex=0.85), grid=TRUE)
p7 = xyplot(result$climateChgCount~result$Time,
            type = c("p","r"), col.line = "red", lwd = 2, 
            xlab = "Date", ylab = "Count", main = list(label="Count for Concept 'Climate Change'", cex=0.85), grid=TRUE)

print(p1, position=c(0, .75, 0.5, 1), more=TRUE)
print(p2, position=c(0, .50, 0.5, 0.75), more=TRUE)
print(p3, position=c(0, 0.25, 0.5, 0.50), more=TRUE)
print(p4, position=c(0.5, 0.75, 1, 1), more=TRUE)
print(p5, position=c(0.5, 0.5, 1, 0.75), more=TRUE)
print(p6, position=c(0.5, 0.25, 1, 0.5), more=TRUE)
print(p7, position=c(0.25, 0, 0.75, 0.25))

# plot 
par(mfrow=c(4,2))
plot(result$Time, result$abortionCount, pch=20, col="#3399FF", xlab = "Date", ylab = "Count", main = "Count for Concept 'Abortion'", cex.main=1.1)
plot(result$Time, result$climateChgCount, pch=20, col="#3399FF", xlab = "Date", ylab = "Count", main = "Count for Concept 'Climate change'", cex.main=1.1)
plot(result$Time, result$gayCount, pch=20, col="#3399FF", xlab = "Date", ylab = "Count", main = "Count for Concept 'Gay'", cex.main=1.1)
plot(result$Time, result$mexicoCount, pch=20, col="#3399FF", xlab = "Date", ylab = "Count", main = "Count for Concept 'Mexico'", cex.main=1.1)
plot(result$Time, result$privacyCount, pch=20, col="#3399FF", xlab = "Date", ylab = "Count", main = "Count for Concept 'Privacy'", cex.main=1.1)
plot(result$Time, result$wallCount, pch=20, col="#3399FF", xlab = "Date", ylab = "Count", main = "Count for Concept 'illegal immigration'", cex.main=1.1)
plot(result$Time, result$wallStCount, pch=20, col="#3399FF", xlab = "Date", ylab = "Count", main = "Count for Concept 'Wall street'", cex.main=1.1)


