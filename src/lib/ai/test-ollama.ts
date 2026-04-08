// Test script for Ollama AI integration
// Run with: node --loader ts-node/esm src/lib/ai/test-ollama.ts

import { getAIService } from './ollama-service'
import type { ChatMessage } from '@/types/food'

async function testAI() {
  console.log('🧪 Testing Ollama AI Integration...\n')
  
  const aiService = getAIService()
  
  // Test 1: Basic chat
  console.log('📝 Test 1: Basic Chat')
  console.log('Question: Boleh saya makan nasi lemak?\n')
  
  const messages: ChatMessage[] = [
    {
      id: '1',
      role: 'user',
      content: 'Mak, boleh saya makan nasi lemak? Saya ada kencing manis.',
      timestamp: new Date().toISOString(),
    },
  ]
  
  const response = await aiService.chat(messages, 'User has diabetes')
  
  console.log('Response:', response.message)
  console.log('Success:', response.success)
  console.log('\n---\n')
  
  // Test 2: Health advice
  console.log('📝 Test 2: Health Advice')
  console.log('Conditions: diabetes, cancer (breast), chemotherapy\n')
  
  const advice = await aiService.getHealthAdvice(['diabetes'], 'breast', 'chemotherapy')
  
  console.log('Food Recommendations:')
  advice.foodRecommendation.forEach((food, i) => console.log(`  ${i + 1}. ${food}`))
  
  console.log('\nAvoid Foods:')
  advice.avoidFoods.forEach((food, i) => console.log(`  ${i + 1}. ${food}`))
  
  console.log('\nTips:')
  advice.tips.forEach((tip, i) => console.log(`  ${i + 1}. ${tip}`))
  
  console.log('\n✅ All tests completed!')
}

testAI().catch(console.error)