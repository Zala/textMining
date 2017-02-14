# Set working directory
setwd("C:/Users/miha/Dropbox/Institut/MPS/Sensor_Text Analysis/textmining/Seminarska/textMining")
######################################################

library('rjson')

# Give the input file name to the function, has to be proper json format
resultJson <- fromJSON(file = "tsStoreDataR.json")

# Print the result.

library('dplyr')
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
xyplot(result$abortionCount~result$Time,  type = c("p","r"),  col.line = "red", xlab = "Date", ylab = "Count", main = "Count for Concept 'Abortion'")
xyplot(result$gayCount~result$Time,       type = c("p","r"), col.line = "red", xlab = "Date", ylab = "Count", main = "Count for Concept 'Gay'")
xyplot(result$privacyCount~result$Time,   type = c("p","r"), col.line = "red", xlab = "Date", ylab = "Count", main = "Count for Concept 'Privacy'")
xyplot(result$mexicoCount~result$Time,    type = c("p","r"), col.line = "red", xlab = "Date", ylab = "Count", main = "Count for Concept 'Mexico'")
xyplot(result$wallCount~result$Time,      type = c("p","r"), col.line = "red", xlab = "Date", ylab = "Count", main = "Count for Concept 'Wall'")
xyplot(result$wallStCount~result$Time,    type = c("p","r"), col.line = "red", xlab = "Date", ylab = "Count", main = "Count for Concept 'Wall Street'")
xyplot(result$climateChgCount~result$Time,type = c("p","r"), col.line = "red", xlab = "Date", ylab = "Count", main = "Count for Concept 'Climate Change'")

# plot 
plot(result$Time, result$abortionCount)
plot(result$Time, result$climateChgCount)
plot(result$Time, result$gayCount)
plot(result$Time, result$mexicoCount)
plot(result$Time, result$privacyCount)
plot(result$Time, result$wallCount)
plot(result$Time, result$wallStCount)