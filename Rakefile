require 'rubygems'
require 'bundler'
require 'pathname'
require 'logger'
require 'fileutils'
require 'yaml'
require 'uglifier'
require 'capybara'
require 'capybara/poltergeist'
require 'nokogiri'
require "colorize"


Bundler.require

Capybara.register_driver :poltergeist do |app|
  Capybara::Poltergeist::Driver.new(app)
end
Capybara.current_driver = :poltergeist
   
#helpers    
class Nokogiri::XML::Element
  def classes
    self.get_attribute("class").split
  end
  def class?(name)
    classes.include?(name)
  end
end

module Test
  include Capybara::DSL
  extend self

  def run
    session = Capybara::Session.new(:poltergeist)
    session.visit "test/SpecRunner.html"
    
    doc = Nokogiri::HTML(session.html)

    failed = doc.css("div#details .failed div.resultMessage.fail").to_enum

    doc.css("div.results > div.summary > div.suite").each do |suite|
      puts "> #{suite.css("a.description").first.text}"

      suite.css("div").each do |div|
        text = div.css("a").first.text 
        if div.class?('specSummary')
          if div.class?("passed")
            puts "---- #{text.colorize(:green)}"
          else
            puts div.text
            puts "---- #{text.colorize(:red)}"
            puts "#{failed.next.text}".colorize(:background => :red)
          end  
        end
        puts "-> #{text}" if div.class?('suite')
      end
    end
  end
end


#Helper module for colorize output
module Colorize 
  extend self

  def red(msg)
    "\e[31m#{msg}\e[0m\n"
  end

  def green(msg)
    "\e[32m#{msg}\e[0m\n"
  end

  def yellow(msg)
    "\e[33m#{msg}\e[0m\n"
  end  
end

module Compile
  extend self 

  def compile!
    FileUtils.rm OUTPUT if File.exist?(OUTPUT)

    sprockets = Sprockets::Environment.new(ROOT) do |env|
      env.logger = LOGGER
    end

    sprockets.append_path(SOURCE_DIR.join('javascript').to_s)
    
    BUNDLES.each do |bundle|
      assets = sprockets.find_asset(bundle)
      assets.write_to(OUTPUT)
    end

    #Remove comments from file
    
    file =Uglifier.compile(File.read(OUTPUT), :compress => false, 
      :output => {:beautify => true})
    
    File.open(OUTPUT, "w"){|f| f.puts file }
  end
end


logger = Logger.new(STDOUT)
logger.formatter = Proc.new do  |severity, time, progname, msg|
  Colorize.green(msg)
end


ROOT        = Pathname(File.dirname(__FILE__))
LOGGER      = logger
BUNDLES     = ["astra_z.js"]
BUILD_DIR   = ROOT.join(".")
SOURCE_DIR  = ROOT.join("src")
SOURCE_FILE = "astra_z.js"
OUTPUT       = BUILD_DIR.join(SOURCE_FILE)
BROWSERS = ["opera", "chromium-browser", "firefox"]
TEST_PATH = ROOT.join("test/SpecRunner.html")
VERSION_FILE = "version.yaml"
VERSION = YAML.load_file("#{SOURCE_DIR}/#{VERSION_FILE}")['ASTRA_Z_VERSION'] 

desc "Join files into one source"
task :compile do
  Compile.compile!
end

desc "Run test in browser passed in arguments."
#
# rake test opera
#
task :test do
  Compile.compile!  
  browser = ARGV[1] || "firefox"
  
  puts Colorize.green"Run test with `#{browser}` browser"
  puts Colorize.yellow(
    "Warning! #{browser} not found in known browsers #{BROWSERS}"
  ) unless BROWSERS.include?(browser)

  `#{browser} #{TEST_PATH}`

  task browser.to_sym do ; end
end 

desc "run tests in console"
task :console do 
  Compile.compile!
  Test.run
end


task :default => :compile
